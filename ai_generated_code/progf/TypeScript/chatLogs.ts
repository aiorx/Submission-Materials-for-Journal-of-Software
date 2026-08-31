import * as yup from "yup";
import { isBefore } from "date-fns";
import { useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { type SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { format, sub } from "date-fns";
import { useToast } from "@chakra-ui/react";
import ExcelJS from "exceljs";

interface EndToDateTestContext extends yup.TestContext {
	parent: {
		dateFrom: Date;
	};
}

export const ChatLogSchema = yup.object().shape({
	chats: yup.array(
		yup.object().shape({
			chatId: yup
				.string()
				.label("target chat id")
				.required()
				.matches(/^[a-z0-9\.:@\-_]+$/gs, "including invalid character"),
			outputName: yup
				.string()
				.label("output name")
				.required()
				.max(30)
				.test(
					"excel-sheetname",
					"including ng character(`\\`, `:`, `?`, `*`, `[` or `]`)",
					(value) => {
						const ng = [
							"\\",
							"　",
							" ",
							":",
							"：",
							"?",
							"？",
							"*",
							"＊",
							"[",
							"［",
							"]",
							"］",
						];
						return !ng.some((e) => value.includes(e));
					},
				),
		}),
	),
	dateFrom: yup
		.date()
		.typeError("no selected target chat modified date")
		.required("no selected target chat modified date"),
	dateTo: yup
		.date()
		.typeError("no selected target chat modified date")
		.required("target chat modified data")
		.test(
			"is-greater",
			"`to-date` must be later than `form-date`",
			function (value) {
				const { dateFrom } = (this as EndToDateTestContext).parent;
				console.log(value);
				if (value === null || value === undefined) return true;
				if (value instanceof Date) {
					return isBefore(dateFrom, value);
				}
				return true;
			},
		),
});

export type ChatLogsParams = yup.InferType<typeof ChatLogSchema>;

export type ChatLogsParam = {
	chatId: string;
	outputName: string;
	dateFrom: Date;
	dateTo: Date;
};

// 面倒なのでサーバー側で正しいテンプレートファイル（のヘッダーやシート名）を使った検証はせずに決め打ちでやる
export const useValidatationChatlogTemplate = () => {
	const toast = useToast();
	const [file, setFile] = useState<File>();
	const [targetChatlog, setTargetChatlog] = useState<TargetChatlogData[]>([]);

	const handleFileChange = async (
		event: React.ChangeEvent<HTMLInputElement>,
	) => {
		// validation
		const MAX_FILE_COUNT = 1;
		const MAX_FILE_SIZE = 1024 * 1024 * 8;
		if (event.target.files === null) {
			return;
		}
		if (event.target.files.length > MAX_FILE_COUNT) {
			toast({
				status: "error",
				description: `添付できるファイル上限数（${MAX_FILE_COUNT}）を超えています`,
			});
			return;
		}

		// MAX_FILE_COUNTでみているが、一応最初のファイルだけにしておく（既存のコンポーネントからもってきたのでそういうのがある）
		const targetFile = event.target.files[0];
		if (targetFile.size > MAX_FILE_SIZE) {
			toast({
				status: "error",
				description: `添付できるファイルあたりサイズ上限（${MAX_FILE_SIZE} byte）を超えています`,
			});
			return;
		}
		// 拡張子チェック
		if (!targetFile.name.toLowerCase().endsWith(".xlsx")) {
			toast({
				status: "error",
				description: "invalid extension",
			});
			return;
		}
		// MIME type再チェック
		if (
			targetFile.type !==
			"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
		) {
			toast({
				status: "error",
				description: "invalid mimetype",
			});
			return;
		}

		// validate excel file
		const arrBuf = await readFileAsArrayBuffer(targetFile);
		const workbook = await loadWorkbook(arrBuf);
		// excelファイル確認 決め打ち
		const expectedsheetname = "payload";
		if (!validateSheetName(workbook, expectedsheetname)) {
			toast({ status: "error", description: "unexpected sheet name" });
			return;
		}
		const sheet = workbook.getWorksheet(expectedsheetname);
		if (!sheet) {
			toast({ status: "error", description: "can't get expected sheet" });
			return;
		}

		if (!validateHeader(sheet, ["*chat id", "*sheet name"])) {
			toast({ status: "error", description: "invalid header" });
			return;
		}

		// TODO: 含まれるデータの値チェック
		const { data, errMsg } = parseChatlogExcelData(sheet);
		if (errMsg) {
			toast({ status: "error", description: errMsg });
			return;
		}
		setTargetChatlog(data);
		setFile(targetFile);
	};

	return { file, targetChatlog, handleFileChange };
};

// Supported via standard programming aids
const readFileAsArrayBuffer = (file: File): Promise<ArrayBuffer> => {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();

		reader.onload = () => {
			if (reader.result instanceof ArrayBuffer) {
				resolve(reader.result);
			} else {
				reject(new Error("Could not read file as ArrayBuffer"));
			}
		};
		reader.onerror = (error) => reject(error);

		reader.readAsArrayBuffer(file);
	});
};

// Supported via standard programming aids
const loadWorkbook = async (buffer: ArrayBuffer): Promise<ExcelJS.Workbook> => {
	const workbook = new ExcelJS.Workbook();
	// ブラウザで動かす場合、以下のように `await workbook.xlsx.load(buffer)` がメイン
	// https://github.com/exceljs/exceljs#browser
	await workbook.xlsx.load(buffer);
	return workbook;
};
// Supported via standard programming aids
const validateSheetName = (
	workbook: ExcelJS.Workbook,
	expectedSheetName: string,
): boolean => {
	const sheet = workbook.getWorksheet(expectedSheetName);
	return sheet !== undefined;
};

// Supported via standard programming aids
const validateHeader = (
	sheet: ExcelJS.Worksheet,
	expectedHeader: string[],
): boolean => {
	// 1行目を取得
	const headerRow = sheet.getRow(1);
	// Row.values は [ , A列, B列, C列, ... ] のように先頭が空になることが多い
	// index=1基準なので注意
	const cellValues = (headerRow.values || []) as (string | undefined)[];

	// Row.values は配列サイズが (最大列Index+1) になる。
	// ExcelJSでは row.values[0] が "undefined" で、row.values[1] が A列の値…という仕様。
	// → したがって、必要に応じて slice(1) するケースも多い。
	const headerCells = cellValues.slice(1); // 先頭の空要素を取り除く

	if (headerCells.length !== expectedHeader.length) {
		return false;
	}

	return expectedHeader.every(
		(col, i) => headerCells[i]?.toLowerCase() === col.toLowerCase(),
	);
};

// supported by ChatGPT
export interface TargetChatlogData {
	chatId: string;
	outputName: string;
}
const parseChatlogExcelData = (
	sheet: ExcelJS.Worksheet,
): { data: TargetChatlogData[]; errMsg?: string } => {
	let ret: TargetChatlogData[] = [];
	const lastRowNum = sheet.lastRow?.number;
	if (lastRowNum === undefined || lastRowNum <= 1) {
		return { data: [], errMsg: "no data" };
	}
	for (let i = 2; i < lastRowNum; i++) {
		const row = sheet.getRow(i);
		// const values = row.values;
		// console.log(`${i} th row value: ${values} (${values.length})`); // なんか長さが+1されるがRow.getCellで取得できるのでよしとする
		const [exceledChatId, exceledSheetName] = [
			row.getCell(1).value?.toString(),
			row.getCell(2).value?.toString(),
		];
		console.log(i, exceledChatId, exceledSheetName);
		// どうせフォームに貼り付けてそっちでバリデーションチェックするので、ここでは簡易的にする
		if (!exceledChatId && !exceledSheetName) continue; // 入力してるつもりなくても数えてしまう場合があるがいっそ無視する
		// 両方ないときは優しさ
		if (exceledChatId === "" && exceledSheetName === "") continue;
		if (
			exceledChatId === "" ||
			!exceledChatId ||
			exceledSheetName === "" ||
			!exceledSheetName
		) {
			return { data: [], errMsg: "included empty data" };
		}
		ret = [...ret, { chatId: exceledChatId, outputName: exceledSheetName }];
	}

	// それぞれ重複チェック
	const [_chatIds, _outputNames] = [
		ret.map((r) => r.chatId),
		ret.map((r) => r.outputName),
	];
	if (_chatIds.length !== new Set(_chatIds).size) {
		return { data: [], errMsg: "not allowed to exist same [chat Id]" };
	}
	if (_outputNames.length !== new Set(_outputNames).size) {
		return { data: [], errMsg: "not allowed to exist same [sheet name]" };
	}

	return { data: ret };
};

export const useChatLogForm = () => {
	const defaultVal: ChatLogsParams = {
		chats: [
			{
				outputName: "",
				chatId: "",
			},
		],

		// input type="date"のデフォルト値は`yyyy-MM-dd`に決まっているが、そうするとstring型になるのは避けられないため、初期値を`as unknown as Date`としている
		dateFrom: format(sub(new Date(), { days: 1 }), "yyyy-MM-dd", {
			// locale: ja, 謎エラー
		}) as unknown as Date,

		dateTo: format(new Date(), "yyyy-MM-dd", {
			// locale: ja, 謎エラー
		}) as unknown as Date,
	};
	const [logData, setLogData] = useState<ChatLogsParams>(defaultVal);

	const [isTriggered, setIsTriggered] = useState<boolean>(false);

	const methods = useForm<ChatLogsParams>({
		mode: "all",
		criteriaMode: "all",
		defaultValues: defaultVal,
		resolver: yupResolver<ChatLogsParams>(ChatLogSchema),
	});

	// TODO: とりあえず複数追加できるようにしたが、複数のinfinitequeryの投げ方と結果の受け取り方のいい実装がわからず、追加を実装していない。
	const { fields, append, remove, replace } = useFieldArray({
		control: methods.control,
		name: "chats",
	});

	const onSubmit: SubmitHandler<ChatLogsParams> = (formData) => {
		setIsTriggered(true);
		setLogData(formData);
	};

	return {
		logData,
		methods,
		onSubmit,
		isTriggered,
		setIsTriggered,
		fields,
		append,
		replace,
		remove,
	};
};

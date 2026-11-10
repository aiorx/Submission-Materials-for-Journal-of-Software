
import { VideoItem } from "@/types";

const ass = `
[Script Info]
; Script Aided using common development resources
Title: Example Subtitle
ScriptType: v4.00+
PlayResX: 1280
PlayResY: 720
ScaledBorderAndShadow: yes
WrapStyle: 0
YCbCr Matrix: TV.601

[Aegisub Project Garbage]
Last Style Storage: Default
Audio File: ?audio
Video File: ?video

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Default,Arial,48,&H00FFFFFF,&H000000FF,&H00000000,&H64000000,0,0,0,0,100,100,0,0,1,2,0,2,10,10,10,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
Dialogue: 0,0:00:01.00,0:00:04.00,Default,,0,0,0,,Hello, this is an example subtitle.
Dialogue: 0,0:00:05.00,0:00:08.00,Default,,0,0,0,,这是第二行字幕，带中文。
Dialogue: 0,0:00:09.00,0:00:12.00,Default,,0,0,0,,第三行字幕 ~ with English mix.
Dialogue: 0,0:00:01.00,0:00:05.00,Default,,0,0,0,,Hello everyone, welcome to this demo!
Dialogue: 0,0:00:05.50,0:00:09.00,Default,,0,0,0,,大家好，欢迎来到字幕演示。
Dialogue: 0,0:00:09.50,0:00:13.00,Default,,0,0,0,,This is line number three, simple and clear.
Dialogue: 0,0:00:13.50,0:00:17.00,Default,,0,0,0,,这是第四行字幕，展示多语言支持。
Dialogue: 0,0:00:17.50,0:00:21.00,Default,,0,0,0,,Line five: testing longer sentences to see wrapping.
Dialogue: 0,0:00:21.50,0:00:25.00,Default,,0,0,0,,第六行：测试更长的中文句子，看看换行效果。
Dialogue: 0,0:00:25.50,0:00:29.00,Default,,0,0,0,,Line seven: Mixing 中文 and English smoothly.
Dialogue: 0,0:00:29.50,0:00:33.00,Default,,0,0,0,,第八行：让字幕显示更自然。
Dialogue: 0,0:00:33.50,0:00:37.00,Default,,0,0,0,,Line nine: Almost done, keep watching.
Dialogue: 0,0:00:37.50,0:00:41.00,Default,,0,0,0,,第十行：字幕演示结束，谢谢观看！
Dialogue: 0,0:00:01.00,0:00:04.00,Default,,0,0,0,,Line 1: Hello, this is a demo subtitle.
Dialogue: 0,0:00:04.00,0:00:07.00,Default,,0,0,0,,第2行：这是一个演示字幕。
Dialogue: 0,0:00:07.00,0:00:10.00,Default,,0,0,0,,Line 3: Subtitles are useful for videos.
Dialogue: 0,0:00:10.00,0:00:13.00,Default,,0,0,0,,第4行：字幕对视频非常有用。
Dialogue: 0,0:00:13.00,0:00:16.00,Default,,0,0,0,,Line 5: They help people understand better.
Dialogue: 0,0:00:16.00,0:00:19.00,Default,,0,0,0,,第6行：它们能帮助人们更好理解。
Dialogue: 0,0:04:52.00,0:04:55.00,Default,,0,0,0,,Line 99: Almost finished, this is near the end.
Dialogue: 0,0:04:55.00,0:04:58.00,Default,,0,0,0,,第100行：终于到最后啦，谢谢观看！
`;

type AssEvent = {
  Layer: string;
  Start: string;
  End: string;
  Style: string;
  Name: string;
  MarginL: string;
  MarginR: string;
  MarginV: string;
  Effect: string;
  Text: string;
};

function assToJson(assText: string): AssEvent[] {
  const lines = assText.split(/\r?\n/);

  // 找到 [Events] 部分
  const eventsStart = lines.findIndex(line => line.trim() === "[Events]");
  if (eventsStart === -1) return [];

  // 找到 Format 行
  const formatLine = lines.slice(eventsStart + 1).find(line => line.startsWith("Format:"));
  if (!formatLine) return [];
  const formatFields = formatLine.replace("Format:", "").split(",").map(f => f.trim());

  // 找到 Dialogue 行
  const dialogueLines = lines.slice(eventsStart + 2).filter(line => line.startsWith("Dialogue:"));

  const result: AssEvent[] = dialogueLines.map(line => {
    // 把 "Dialogue:" 去掉
    const raw = line.replace("Dialogue:", "").trim();
    const parts = raw.split(",");

    const entry: Partial<AssEvent> = {};
    for (let i = 0; i < formatFields.length - 1; i++) {
      entry[formatFields[i] as keyof AssEvent] = parts[i]?.trim() ?? "";
    }

    // Text 部分可能包含逗号，需要合并
    entry.Text = parts.slice(formatFields.length - 1).join(",").trim();

    return entry as AssEvent;
  });

  return result;
}


/* ----------------- 示例数据 ----------------- */
export const SAMPLE_VIDEOS: VideoItem[] = [
  {
    id: 1,
    src: "英语学习【奇幻沼泽第一季~第三季】 p02 第一季2拐杖风波 [BV1XUbtzsEJT_p2].mp4",
    title: "第一季2拐杖风波",
    author: "bunny",
    likes: 13200,
    comments: 560,
    shares: 120,
    avatar: "https://i.pravatar.cc/100?img=1"
  },
  {
    id: 2,
    src: "英语学习【奇幻沼泽第一季~第三季】 p03 第一季3跳爷爷的料理 [BV1XUbtzsEJT_p3].mp4",
    title: "第一季3跳爷爷的料理",
    author: "bunny",
    likes: 13200,
    comments: 560,
    shares: 120,
    avatar: "https://i.pravatar.cc/100?img=1"
  },
  {
    id: 3,
    src: "英语学习【奇幻沼泽第一季~第三季】 p04 第一季4多米诺效应 [BV1XUbtzsEJT_p4].mp4",
    title: "第一季4多米诺效应",
    author: "bunny",
    likes: 13200,
    comments: 560,
    shares: 120,
    avatar: "https://i.pravatar.cc/100?img=1"
  },
  {
    id: 4,
    src: "英语学习【奇幻沼泽第一季~第三季】 p05 第一季5侠盗猎车手小安 [BV1XUbtzsEJT_p5].mp4",
    title: "第一季5侠盗猎车手小安",
    author: "bunny",
    likes: 13200,
    comments: 560,
    shares: 120,
    avatar: "https://i.pravatar.cc/100?img=1"
  },
  {
    id: 5,
    src: "英语学习【奇幻沼泽第一季~第三季】 p06 第一季6盆盆大战跳爷爷 [BV1XUbtzsEJT_p6].mp4",
    title: "第一季6盆盆大战跳爷爷",
    author: "bunny",
    likes: 13200,
    comments: 560,
    shares: 120,
    avatar: "https://i.pravatar.cc/100?img=1"
  },
  {
    id: 6,
    src: "英语学习【奇幻沼泽第一季~第三季】 p07 第一季7约会季 [BV1XUbtzsEJT_p7].mp4",
    title: "第一季7约会季",
    author: "bunny",
    likes: 13200,
    comments: 560,
    shares: 120,
    avatar: "https://i.pravatar.cc/100?img=1"
  },
  {
    id: 7,
    src: "英语学习【奇幻沼泽第一季~第三季】 p08 第一季8红腿病风波 [BV1XUbtzsEJT_p8].mp4",
    title: "第一季8红腿病风波",
    author: "bunny",
    likes: 13200,
    comments: 560,
    shares: 120,
    avatar: "https://i.pravatar.cc/100?img=1"
  },
  {
    id: 8,
    src: "英语学习【奇幻沼泽第一季~第三季】 p09 第一季9莲叶泰食 [BV1XUbtzsEJT_p9].mp4",
    title: "第一季9莲叶泰食",
    author: "bunny",
    likes: 13200,
    comments: 560,
    shares: 120,
    avatar: "https://i.pravatar.cc/100?img=1"
  },
  {
    id: 9,
    src: "英语学习【奇幻沼泽第一季~第三季】 p10 第一季10蟾蜍税 [BV1XUbtzsEJT_p10].mp4",
    title: "第一季10蟾蜍税",
    author: "bunny",
    likes: 13200,
    comments: 560,
    shares: 120,
    avatar: "https://i.pravatar.cc/100?img=1"
  },
];


export const MOCK_SAMPLE_ASS = assToJson(ass);
export const MOCK_SAMPLE_VIDEOS = SAMPLE_VIDEOS;
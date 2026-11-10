const letterList = 'abcdefghijklmnopqrstuvwxyz';
const numberList = '0123456789';

const startChar = "" + (letterList) + "" + (letterList.toUpperCase()) + "_";
const nameChar = "" + (startChar) + "" + (numberList) + "-";

const startLen = startChar.length;
const nameLen = nameChar.length;

const sList = startChar.split('');
let slen = startLen;
let pi = 0;

const createShortenID = (si: number): function string {
	while (si >= slen) {
		sList.push(...nameChar.split('').map(s => sList[pi] + s));
		slen += nameLen;
		pi++;
	}
	return sList[si];
};

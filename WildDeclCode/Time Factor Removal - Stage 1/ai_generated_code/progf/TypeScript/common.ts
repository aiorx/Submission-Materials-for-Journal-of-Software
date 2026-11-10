// Portions of this code were generated and or inspired by the help of GitHub Copilot or Chatgpt
var Timestamp = require('firebase-admin/firestore').Timestamp;
var DocumentReference = require('firebase-admin/firestore').DocumentReference;

/**
 * This error is used for parsing errors
 */
class ParseError extends Error { }

export interface Document {
    addedAt: Timestamp,
    fileFormat: string,
    fileSize: number,
    title: string,
    travelRef: DocumentReference,
    visibility: string
}

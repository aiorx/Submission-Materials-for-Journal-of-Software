var functions = require('firebase-functions');
var admin = require('firebase-admin');

const adminDB = admin.initializeApp()
const firestoreDB = adminDB.firestore()

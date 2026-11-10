var functions = require('firebase-functions');

var dialogflow = require('actions-on-google').dialogflow;
var i18n = require('@sfeir/actions-on-google-i18n');

const app = dialogflow({ debug: true });
i18n
    .configure({
        directory: "" + (__dirname) + "/../locales",
        defaultLocale: 'en-us'
    })
    .use(app);

app.intent('excuse-generator', function (conv: any) {
    conv.close("" + (conv.__('INITIALS')) + " " + (conv.__('EXCUSES')) + ".");
});

const generateExcuse = functions.https.onRequest(app);

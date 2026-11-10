var functions = require('firebase-functions');
var admin = require('firebase-admin');
var express = require('express');
var crypto = require('crypto');

admin.initializeApp();
const webhookApp = express();
webhookApp.post("/:key", async function (req: any, res: any) {
  const user = await (
    await admin.database().ref("/keys/" + (req.params.key) + "").get()
  ).val();
  if (!user) {
    return res.status(403).send("invalid key");
  }
  const today = new Date();
  const exp = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() + 7
  );

  let path: string;
  const qPath: unknown = req.query.path;
  if (typeof qPath === "string") {
    path = qPath;
  } else if (Array.isArray(qPath)) {
    path = qPath[0];
  } else {
    return res
      .status(422)
      .send(
        "path not a valid format. expected string recieved " + (JSON.stringify(
          qPath
        )) + ""
      );
  }

  const buffer = {
    id: crypto.randomBytes(16).toString("hex"),
    path,
    exp,
    data: req.rawBody.toString(),
  };
  await admin.database().ref("/buffer/" + (user) + "").push(buffer);
  res.send("ok");
});
const webhook = functions.https.onRequest(webhookApp);

const newUser = functions.auth.user().onCreate(function (user) {
  const key = crypto.randomBytes(24).toString("hex");
  admin.database().ref("/keys/" + (key) + "").set(user.uid);
  admin.database().ref("/users/" + (user.uid) + "/key").set(key);
});

const wipe = functions.https.onCall(async function (data, context) {
  if (context.auth) {
    const user = await admin.auth().getUser(context.auth.uid);
    if (user.providerData[0].providerId != "anonymous") {
      const db = admin.database();
      const ref = db.ref("/buffer/" + (user.uid) + "");
      await ref.transaction((buffer) => {
        if (buffer == null) {
          return buffer;
        }
        if (typeof buffer == "object") {
          const arr: { id: string }[] = Object.values(buffer);
          const index = arr.findIndex((v) => v.id === data.id);
          return arr.splice(index + 1);
        }
        throw new Error(
          "buffer not as expected " + (typeof buffer) + " " + (JSON.stringify(buffer)) + ""
        );
      });
    }
  }
});

const generateObsidianToken = functions.https.onCall(
  function (_data, context) {
    if (context.auth) {
      return admin.auth().createCustomToken(context.auth.uid);
    }
    throw new Error("authed only");
  }
);

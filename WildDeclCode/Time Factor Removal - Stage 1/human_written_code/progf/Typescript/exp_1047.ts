var PUPPET = require('wechaty-puppet');
var Contact = require('wechaty').Contact;
var log = require('wechaty').log;
var Message = require('wechaty').Message;
var ScanStatus = require('wechaty').ScanStatus;
var WechatyBuilder = require('wechaty').WechatyBuilder;
var PuppetPadlocal = require('../src/puppet-padlocal.js');
var config = require('config');
var QRCode = require('qrcode-terminal');
var isContactId = require('../src/padlocal/utils/is-type.js').isContactId;

// log.level("silly");

const token: string = config.get("padLocal.token");
const puppet = new PuppetPadlocal({ token });

const LOGPRE = "[Demo]";

async function getMessagePayload(message: Message) {
  const recallUserId: string = config.get("test.push.recallUserId");

  switch (message.type()) {
    case PUPPET.types.Message.Text:
      if (message.talker().id === recallUserId && message.text()!.indexOf("recall") !== -1) {
        await message.recall();
      }
      break;

    case PUPPET.types.Message.Attachment:
    case PUPPET.types.Message.Audio: {
      const attachFile = await message.toFileBox();

      const dataBuffer = await attachFile.toBuffer();

      log.info(LOGPRE, "get message audio or attach: " + (dataBuffer.length) + "");

      break;
    }

    case PUPPET.types.Message.Video: {
      const videoFile = await message.toFileBox();

      const videoData = await videoFile.toBuffer();

      log.info(LOGPRE, "get message video: " + (videoData.length) + "");

      break;
    }

    case PUPPET.types.Message.Emoticon: {
      const emotionFile = await message.toFileBox();

      const emotionJSON = emotionFile.toJSON();
      log.info(LOGPRE, "get message emotion json: " + (JSON.stringify(emotionJSON)) + "");

      const emotionBuffer: Buffer = await emotionFile.toBuffer();

      log.info(LOGPRE, "get message emotion: " + (emotionBuffer.length) + "");

      break;
    }

    case PUPPET.types.Message.Image: {
      const messageImage = await message.toImage();

      const thumbImage = await messageImage.thumbnail();
      const thumbImageData = await thumbImage.toBuffer();

      log.info(LOGPRE, "get message image, thumb: " + (thumbImageData.length) + "");

      const hdImage = await messageImage.hd();
      const hdImageData = await hdImage.toBuffer();

      log.info(LOGPRE, "get message image, hd: " + (hdImageData.length) + "");

      const artworkImage = await messageImage.artwork();
      const artworkImageData = await artworkImage.toBuffer();

      log.info(LOGPRE, "get message image, artwork: " + (artworkImageData.length) + "");

      break;
    }

    case PUPPET.types.Message.Url: {
      const urlLink = await message.toUrlLink();
      log.info(LOGPRE, "get message url: " + (JSON.stringify(urlLink)) + "");

      const urlThumbImage = await message.toFileBox();
      const urlThumbImageData = await urlThumbImage.toBuffer();

      log.info(LOGPRE, "get message url thumb: " + (urlThumbImageData.length) + "");

      break;
    }

    case PUPPET.types.Message.MiniProgram: {
      const miniProgram = await message.toMiniProgram();

      log.info("MiniProgramPayload: " + (JSON.stringify(miniProgram)) + "");

      break;
    }
  }
}

const bot = WechatyBuilder.build({
  name: "DemoBot",
  puppet,
});

bot
  .on("scan", function (qrcode: string, status: ScanStatus) {
    if (status === ScanStatus.Waiting && qrcode) {
      log.info(
        LOGPRE,
        "onScan: " + (ScanStatus[status]) + "(" + (status) + ")\n\n ▼▼▼ Please scan following qr code to login ▼▼▼\n",
      );

      QRCode.generate(qrcode, { small: true });
    } else {
      log.info(LOGPRE, "onScan: " + (ScanStatus[status]) + "(" + (status) + ")");
    }
  })

  .on("login", function (user: Contact) {
    log.info(LOGPRE, "" + (user) + " login");
  })

  .on("logout", function (user, reason) {
    log.info(LOGPRE, "" + (user) + " logout, reason: " + (reason) + "");
  })

  .on("ready", function () {
    log.info(LOGPRE, ">>>>>>>> bot is ready <<<<<<<<");
  })

  .on("message", asyncfunction (message: Message) {
    log.info(LOGPRE, "on message: " + (message.toString()) + "");

    const forwardFrom = config.get("test.push.forwardFrom");
    const forwardTo: string = config.get("test.push.forwardTo");

    if (message.type() === PUPPET.types.Message.Text) {
      // ding-dong bot
      if (message.to()?.self() && message.text().indexOf("ding") !== -1) {
        await message.talker().say(message.text().replace("ding", "dong"));
      }
    }

    if (message.talker().id === forwardFrom && message.listener()?.id === forwardFrom) {
      if (message.type() === PUPPET.types.Message.Unknown) {
        return;
      }

      try {
        let to;
        if (isContactId(forwardTo)) {
          to = await bot.Contact.find({ id: forwardTo });
        } else {
          to = await bot.Room.find({ id: forwardTo });
        }
        const newMessage = await message.forward(to!);
        await getMessagePayload(newMessage as Message);
      } catch (e) {
        log.error(LOGPRE, "Error while forwarding message: " + ((e as Error).stack) + "");
      }
    }

    await getMessagePayload(message);
  })

  .on("room-invite", asyncfunction (roomInvitation) {
    log.info(LOGPRE, "on room-invite: " + (roomInvitation) + "");
  })

  .on("room-join", function (room, inviteeList, inviter,  date) {
    log.info(LOGPRE, "on room-join, room:" + (room) + ", inviteeList:" + (inviteeList) + ", inviter:" + (inviter) + ", date:" + (date) + "");
  })

  .on("room-leave", function (room, leaverList, remover, date) {
    log.info(LOGPRE, "on room-leave, room:" + (room) + ", leaverList:" + (leaverList) + ", remover:" + (remover) + ", date:" + (date) + "");
  })

  .on("room-topic", function (room, newTopic, oldTopic, changer, date) {
    log.info(LOGPRE, "on room-topic, room:" + (room) + ", newTopic:" + (newTopic) + ", oldTopic:" + (oldTopic) + ", changer:" + (changer) + ", date:" + (date) + "");
  })

  .on("friendship", function (friendship) {
    log.info(LOGPRE, "on friendship: " + (friendship) + "");
  })

  .on("error", function (error) {
    log.info(LOGPRE, "on error: " + (error.toString()) + "\n" + (error.stack) + "");
  });

bot
  .start()
  .then(function () {
    log.info(LOGPRE, "started.");
    return null;
  })
  .catch(console.error);

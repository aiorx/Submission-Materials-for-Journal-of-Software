/**
	*APAAN BRO? SC BY FDHLGRPHY
	*MAU BANTU KEMBANGIN/NGEFIX YG EROR? LANGSUNG COMMIT AJA BANG
	*CONTACT https://wa.me/6282135724604
*/
var generateMessageID = require.generateMessageID;
var downloadContentFromMessage = require.downloadContentFromMessage;
var proto = require.proto;
var generateWAMessageFromContent = require.generateWAMessageFromContent;
var prepareWAMessageMedia = require.prepareWAMessageMedia;
var areJidsSameUser = require.areJidsSameUser;
var getLastMessageInChat = require.getLastMessageInChat;
var jidDecode = require.jidDecode;('@adiwajshing/baileys');
var colors = require('colors');
var axios = require('axios');
var util = require('util');
var chalk = require('chalk');
var times = require.times;
var fetchJson = require.fetchJson;
var isUrl = require.isUrl;
var getBuffer = require.getBuffer;
var getRandom = require.getRandom;
var sleep = require.sleep;
var getGroupAdmins = require.getGroupAdmins;
var downloadMediaMessage = require.downloadMediaMessage;
var runtime = require.runtime;
var jsonformat = require.jsonformat;
var formatDate = require.formatDate;
var tanggal = require.tanggal;
var formatp = require.formatp;('./utils/smsg');
var y2mateV = require.y2mateV;
var y2mateA = require.y2mateA;('./utils/ytdl');
var fs = require('fs');
var os = require('os');
var color = require.color;
var mylog = require.mylog;
var infolog = require.infolog;("./lib/color")
var moment = require('moment-timezone');
var ytdl = require('ytdl-core');
var hentai = require('nhentai');
var fdl = require("caliph-api");
var hikki = require("hikki-me");
var ffmpeg = require('fluent-ffmpeg');
var PhoneNumber = require('awesome-phonenumber');
var readline = require('readline');
var performance = require.performance;('perf_hooks');
var speed = require('performance-now')
var exec = require.exec;
var spawn = require.spawn;('child_process');
var toMs = require("ms")
global.prem = require("./lib/premium")
var {isLimit:isLimit,limitAdd:limitAdd,getLimit:getLimit,giveLimit:giveLimit,addBalance:addBalance,kurangBalance:kurangBalance,getBalance:getBalance,isGame:isGame,gameAdd:gameAdd,givegame:givegame,cekGLimit:cekGLimit} = require("./lib/limit")
//let regis = JSON.parse(fs.readFileSync('./database/reg.json'));
//global.limit=JSON.parse(fs.readFileSync("./database/limit.json"))
var print = console.log;
//const cooldown = new Map();
var cooldown = new Map();

var fke = '```'

function kyun(seconds){
function pad(s){
return (s < 10 ? '0' : '') + s;
}
var hours = Math.floor(seconds / (60*60));
var minutes = Math.floor(seconds % (60*60) / 60);
var seconds = Math.floor(seconds % 60);

//return pad(hours) + ':' + pad(minutes) + ':' + pad(seconds)
return "" + (pad(hours)) + " Jam " + (pad(minutes)) + " Menit " + (pad(seconds)) + " Detik"
}


module.exports = index = asyncfunction (conn, m, store, warn) {
try {
	var body = (m.mtype === 'conversation') ? m.message.conversation : (m.mtype == 'imageMessage') ? m.message.imageMessage.caption : (m.mtype == 'videoMessage') ? m.message.videoMessage.caption : (m.mtype == 'extendedTextMessage') ? m.message.extendedTextMessage.text : (m.mtype == 'buttonsResponseMessage') ? m.message.buttonsResponseMessage.selectedButtonId : (m.mtype == 'listResponseMessage') ? m.message.listResponseMessage.singleSelectReply.selectedRowId : (m.mtype == 'templateButtonReplyMessage') ? m.message.templateButtonReplyMessage.selectedId : (m.mtype === 'messageContextInfo') ? (m.message.buttonsResponseMessage?.selectedButtonId || m.message.listResponseMessage?.singleSelectReply.selectedRowId || m.text) : ''
	//var body = (m.mtype === 'conversation') ? m.message.conversation : (m.mtype == 'imageMessage') ? m.message.imageMessage.caption : (m.mtype == 'videoMessage') ? m.message.videoMessage.caption : (m.mtype == 'extendedTextMessage') ? m.message.extendedTextMessage.text : (m.mtype == 'buttonsResponseMessage') ? m.message.buttonsResponseMessage.selectedButtonId : (m.mtype == 'listResponseMessage') ? m.omessage.listResponseMessage.singleSelectReply.selectedRowId : (m.mtype == 'templateButtonReplyMessage') ? m.message.templateButtonReplyMessage.selectedId : (m.mtype === 'messageContextInfo') ? m.message.buttonsResponseMessage.selectedButtonId : ''
	var budy = (m.mtype === 'conversation') ? m.message.conversation : (m.mtype === 'extendedTextMessage') ? m.message.extendedTextMessage.text : ''
	var prefix = prefa ? /^[°•π÷×¶∆£¢€¥®™+✓_=|~!?@#$%^&.©^]/gi.test(body) ? body.match(/^[°•π÷×¶∆£¢€¥®™+✓_=|~!?@#$%^&.©^]/gi)[0] : "" : (prefa != null ? prefa : global.prefix)
	var jsn = JSON.parse(fs.readFileSync('./src/database.json'));
	var snt = JSON.parse(fs.readFileSync('./database/anoucement.json'));
	var dta = JSON.parse(fs.readFileSync('./database/setting.json'));
	var args = body.trim().split(/ +/).slice(1)
	var arg = body.substring(body.indexOf(" ") + 1);
	var isCmd = body.startsWith(prefix)
	var command = body.replace(prefix, '').trim().split(/ +/).shift().toLowerCase()
	var from = m.key.remoteJid ? m.key.remoteJid : m.key.participant
	var sender = m.key.participant ? m.key.participant : m.key.remoteJid
	var senderName = m.pushName ? m.pushName : ''
	var pushname = m.pushName || "No Name"
	var text = q = args.join(" ")
	var fatkuns = (m.quoted || m)
	var quoted = (fatkuns.mtype == 'buttonsMessage') ? fatkuns[Object.keys(fatkuns)[1]] : (fatkuns.mtype == 'templateMessage') ? fatkuns.hydratedTemplate[Object.keys(fatkuns.hydratedTemplate)[1]] : (fatkuns.mtype == 'product') ? fatkuns[Object.keys(fatkuns)[0]] : m.quoted ? m.quoted : m
	var mime = (quoted.msg || quoted).mimetype || ''
	var qmsg = (quoted.msg || quoted)
	var isMedia = /image|video|sticker|audio/.test(mime)

	var isGroup = from.endsWith('@g.us')
	var groupMetadata = isGroup ? await conn.groupMetadata(from) : ''
	var groupName = isGroup ? groupMetadata.subject : ''
	var groupDesc = isGroup ? groupMetadata.desc : ''
	var groupId = isGroup ? groupMetadata.id : ''
	var number = ["global.owner@s.whatsapp.net"]
	var isOwner = number.includes(sender)
	var botNumber = await conn.decodeJid(conn.user.id)
	var isCreator = [botNumber, ...global.owner].map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').includes(m.sender)
	var groupMembers = isGroup ? groupMetadata.participants : ''
	var groupAdmins = isGroup ? await getGroupAdmins(groupMembers) : ''
	//const isReg = regis.includes(sender)
	var isGroupAdmins = isGroup ? await groupAdmins.includes(sender) : false
	var isBotGroupAdmins = isGroup ? await groupAdmins.includes(sender) : false
	var isPremium = isCreator || prem.checkPremiumUser(m.sender, premium);
	
	var isBotAdmins = m.isGroup ? groupAdmins.includes(botNumber) : false
    var isAdmins = m.isGroup ? groupAdmins.includes(m.sender) : false
	var participants = m.isGroup ? await groupMetadata.participants : ''
	//const isSpam = timestamps.set(from, now)
	var who = m.mentions && m.mentions[0] ? m.mentions : m.fromMe ? this.user : m.sender 
	require('./setting');
	
	/*function printSpam(conn, isGc, sender, groupName) {
	if (isGc) {
		return conn.logger.warn("Detect SPAM", color(sender.split("@")[0], "lime"), "in", color(groupName, "lime"));
	}
	if (!isGc) {
		return conn.logger.warn("Detect SPAM", color(sender.split("@")[0], "lime"));
	}
}*/

var downloadContentFromMediaMessage = async(m) => {
var mime = (m.msg || m).mimetype || ''
var stream = await downloadContentFromMessage(m.quoted ? m.quoted : m.msg, mime.split("/")[0])
var buffer = Buffer.from([])
for await(var chunk of stream) {
buffer = Buffer.concat([buffer, chunk])
}
return buffer
}

	//FAKE REPLY EX : { quoted: fake }
	var fake = {
	 key: { 
          fromMe: false,
	      participant: "0@s.whatsapp.net", ...(from ? 
	 { remoteJid: "6283102650464-1589321480@g.us" } : {}) 
                },
	 message: { 
		"extendedTextMessage": {
                 "text": "*Hallo* _" + (pushname) + " 👋_\n	╰≻ " + (prefix + command) + "",
                 "title": "Hmm",
                 'jpegThumbnail': global.thumb
                        }
	                  } 
                     }

	var fdoc = {key : {participant : '0@s.whatsapp.net'},message: {documentMessage: {title: "*HIDETAG!*",jpegThumbnail: global.thumb}}}
	var fgclink = {key: {participant: "0@s.whatsapp.net","remoteJid": "0@s.whatsapp.net"},"message": {"groupInviteMessage": {"groupJid": "6283102650464-1589321480@g.us","inviteCode": "m","groupName": "Crizzy Bot", "caption": "© Fadhil Graphy", 'jpegThumbnail': global.thumb}}}
    var fvideo = {key: { fromMe: false,participant: "0@s.whatsapp.net", ...(from ? { remoteJid: "6283102650464-1589321480@g.us" } : {}) },message: { "videoMessage": { "title":"*AUTO DOWNLOAD AUDIO YOUTUBE*", "h": "Hmm",'seconds': '10000000⁰0', 'caption': "*AUTO DOWNLOAD AUDIO YOUTUBE*", 'jpegThumbnail': global.thumb}}}

		//TEMPLATE BUTTON!
		var buttonsDefault = [
			//{ callButton: { displayText: `Call Owner!`, phoneNumber: `+6285849261085` } },
			{ urlButton: { displayText: "github!", url : "https://github.com/FebriansyahXd" } },
			{ quickReplyButton: { displayText: "🧑 owner", id: "" + (prefix) + "owner" } },
			{ quickReplyButton: { displayText: "💰 donate", id: "" + (prefix) + "donate" } },
			{ quickReplyButton: { displayText: "🗼 ping bot", id: "" + (prefix) + "pingbot" } }
		]

		//PREM EXP
		prem.expiredCheck(conn, m, premium);
		
		//EXP
		if (jsn[0].expired !== false) {
  		if (jsn[0].expired < Date.now()) {
    		jsn[0] = {
      		setting: 'tidak ada iklan',
      		expired: false
    		}
    		fs.writeFileSync('./src/database.json', JSON.stringify(jsn))
  		}
		}

		//ANTI SPAM GA WORK, FIX AJA KALO BISA
/*if (!command) return;
const isSpam = true;
const cooldownAmount = 5;
function printSpam(conn, isGroup, sender, groupName) {
  if (isGroup) {
    return console.log("Detect SPAM", color(sender.split("@")[0], "lime"), "in", color(groupName, "lime"));
  }
  if (!isGroup) {
    return console.log("Detect SPAM", color(sender.split("@")[0], "lime"));
  }
}

if (!cooldown.has(from)) {
  cooldown.set(from, new Map());
}

const now = Date.now();
const timestamps = cooldown.get(from);
const cdAmount = (cooldownAmount || 5) * 1000;
if (timestamps.has(from)) {
  const expiration = timestamps.get(from) + cdAmount;
  if (now < expiration) {
    if (isGroup) {
      let timeLeft = (expiration - now) / 1000;
      printSpam(conn, isGroup, sender, groupName);
      return await conn.sendMessage(
        from,
        {
          text: `This group is on cooldown, please wait another _${timeLeft.toFixed(1)} second(s)_`,
        },
        {
          quoted: m
        }
      );
    } else if (!isGroup) {
      let timeLeft = (expiration - now) / 1000;
      printSpam(conn, isGroup, sender);
      return await conn.sendMessage(
        from,
        {
          text: `You are on cooldown, please wait another _${timeLeft.toFixed(1)} second(s)_`,
        },
        {
          quoted: m
        }
      );
    }
  }
}

setTimeout(() => timestamps.delete(from), cdAmount);

if (isSpam) {
  timestamps.set(from, now);
}*/
		
	/*if (optionsCmd.isPremium && !isPremium) {
			await conn.sendMessage(msg.from, { text: response.OnlyPrem }, { quoted: msg });
			return true;
		}*/
		
   // Push Message To Console && Auto Read
        if (m.message) {
            conn.readMessages([m.key])
            console.log(chalk.black(chalk.bgWhite('[ PESAN ]')), chalk.white(chalk.bgGreen(new Date)) + '\n          ' + chalk.white(chalk.bgMagenta(budy || m.mtype)) + '\n' + chalk.green('=> Dari'), chalk.magenta(pushname), chalk.yellow(m.sender) + '\n' + chalk.green('=> Di'), chalk.blueBright(m.isGroup ? pushname : 'Private Chat', from) + '\n' + chalk.magenta('──────────────────────────────────────────────────────'))
        }
//+++++++++++++ START COMMAND +++++++++++++++
switch(command){
			case'menu':
			case'help': {
				footerr = "Peringatan : Dilarang spam command/apapun ke bot!, dikarena mengakibatkan bot eror!\n© 2022 Fadhil Graphy"
				anu = "" + (fke) + "Hi " + (m.pushName) + " 👋, i'am crizzy!" + (fke) + "

╭──❲ *CRIZZY BOT - MD* ❳
│
│ *Info*
│> *Nama :* _「 " + (m.pushName) + " 」_
│> *Status :* _「 " + (isPremium ? "Premium" : "Free") + " 」_
│> *Nomer :* _「 " + (m.sender.split("@")[0]) + " 」_
│> *Jam :* _「 " + (times(new Date)) + " 」_
│> *Tanggal :* _「 " + (tanggal(new Date)) + " 」_
│> *Runtime :* _「 " + (runtime(process.uptime())) + " 」_
│
│ *Keterangan*
│ • 🆆 = Fitur Berfungsi
│ • 🅴 = Fitur Eror
│ • 🅼 = Fitur Maintenance 
│
│ *Search Menu:*
│   ╰≻ " + (prefix) + "play [query] 🆆
│   ╰≻ " + (prefix) + "ytsearch [query] 🆆
│   ╰≻ " + (prefix) + "pinterest 🆆
│
│ *Group Menu:*
│   ╰≻ " + (prefix) + "add [number] 🆆
│   ╰≻ " + (prefix) + "kick [tag] 🆆
│   ╰≻ " + (prefix) + "tagall [psn] 🆆
│   ╰≻ " + (prefix) + "promote [tag] 🆆
│   ╰≻ " + (prefix) + "demote [tag] 🆆
│   ╰≻ " + (prefix) + "setname [text] 🆆
│   ╰≻ " + (prefix) + "setppgroup [reply] 🆆
│   ╰≻ " + (prefix) + "setdesk [text] 🆆
│   ╰≻ " + (prefix) + "hidetag [text] 🆆
│   ╰≻ " + (prefix) + "totag [reply] 🆆
│   ╰≻ " + (prefix) + "linkgroup 🆆
│
│ *Convert Menu :*
│   ╰≻ " + (prefix) + "nulis [text] 🆆
│   ╰≻ " + (prefix) + "sticker/s 🆆
│   ╰≻ " + (prefix) + "stickergif 🆆
│   ╰≻ " + (prefix) + "swm [q|q] 🆆
│   ╰≻ " + (prefix) + "toimg [reply] 🆆
│   ╰≻ " + (prefix) + "style [text] 🆆
│   ╰≻ " + (prefix) + "emojimix (😊+😐) 🆆
│   ╰≻ " + (prefix) + "emojimix2 (😐+😊) 🅼
│   ╰≻ " + (prefix) + "smeme [q|q] 🆆
│   ╰≻ " + (prefix) + "ttp [text] 🆆
│   ╰≻ " + (prefix) + "attp [text] 🆆
│   ╰≻ " + (prefix) + "ebinary [text] 🆆
│   ╰≻ " + (prefix) + "dbinary [code] 🆆
│   ╰≻ " + (prefix) + "tomp4 [send/reply] 🆆
│   ╰≻ " + (prefix) + "toaud [send/reply] 🆆
│   ╰≻ " + (prefix) + "tomp3 [send/reply] 🆆
│   ╰≻ " + (prefix) + "tovn [send/reply] 🆆
│   ╰≻ " + (prefix) + "togif [send/reply] 🆆
│   ╰≻ " + (prefix) + "tourl [send/reply] 🆆
│
│ *Fun Menu :*
│   ╰≻ " + (prefix) + "menfes 🆆
│   ╰≻ " + (prefix) + "jadian 🆆
│   ╰≻ " + (prefix) + "jodohku 🆆
│
│ *Downloader Menu :*
│   ╰≻ " + (prefix) + "tiktok [url] 🆆
│   ╰≻ " + (prefix) + "tiktokaudio [url] 🆆
│   ╰≻ " + (prefix) + "ytmp3 [url] 🆆
│   ╰≻ " + (prefix) + "ytmp4 [url] 🆆
│
│ *Premium Menu :*
│   ╰≻ " + (prefix) + "join [link] 🆆
│
│ *Other Menu :*
│   ╰≻ " + (prefix) + "requestfitur [text] 🆆
│   ╰≻ " + (prefix) + "ping 🆆
│   ╰≻ " + (prefix) + "listonline 🆆
│   ╰≻ " + (prefix) + "listgc 🆆
│   ╰≻ " + (prefix) + "listpc 🆆
│
│ *Owner Menu :*
│   ╰≻ " + (prefix) + "setiklan 🆆
│   ╰≻ " + (prefix) + "block [tag] 🆆
│   ╰≻ " + (prefix) + "unblock [tag] 🆆
│   ╰≻ " + (prefix) + "setstatusbot [text] 🆆
│   ╰≻ " + (prefix) + "setmamebot [text] 🆆
│   ╰≻ " + (prefix) + "setppbot [reply] 🆆
│   ╰≻ " + (prefix) + "cekkomisi 🆆
│   ╰≻ " + (prefix) + "leave 🆆
│   ╰≻ " + (prefix) + "anticall 🆆
│   ╰≻ " + (prefix) + "addprem [tag jum] 🆆
│   ╰≻ " + (prefix) + "delprem [tag] 🆆
│   ╰≻ " + (prefix) + "tarikkomisi [jum] 🆆
│   ╰≻ " + (prefix) + "sf [reply code] 🆆
│   ╰≻ " + (prefix) + "addanoucment (new fitur) 🆆
│   ╰≻ > 🆆
│   ╰≻ => 🆆
│   ╰≻ $ 🆆
│
│ *Store*
│   │≻ *Followers/Like/View*
│   │		╰≻ " + (prefix) + "order ( cara order) 🆆
│   │		╰≻ " + (prefix) + "followers [jum|targ] 🆆
│   │		╰≻ " + (prefix) + "view [jum|link] 🆆
│   │		╰≻ " + (prefix) + "like [jum|link] 🆆
│   │		╰≻ " + (prefix) + "cekstatus [id] 🆆
│   │		╰≻ " + (prefix) + "prichlist 🆆
│   │		
│   ╰≻ *Tes*
│
│ *Anoucement 📢 :*
│   ╰≻ Added " + (snt[4]) + "
│   ╰≻ Added " + (snt[3]) + "
│   ╰≻ Added " + (snt[2]) + "
│   ╰≻ Added " + (snt[1]) + "
│   ╰≻ Added " + (snt[0]) + "
│
╰────────────────⊱
",
					btn = [{
                                urlButton: {
                                    displayText: 'ꜰᴏʟʟᴏᴡ ɪɴꜱᴛᴀɢʀᴀᴍ',
                                    url: 'https://instagram.com/fdhlgrphy'
                                }
                            }, {
                                urlButton: {
                                    displayText: 'ɢʀᴏᴜᴘ ᴡʜᴀᴛꜱᴀᴘᴘ',
                                    url: 'https://chat.whatsapp.com/KX1gNmG96RHC2oUlNy3Wdz'
                                }
                            }, {
                                quickReplyButton: {
                                    displayText: '❗ ᴄʀᴇᴅɪᴛ',
                                    id: 'credit'
                                }
                            }, {
                                quickReplyButton: {
                                    displayText: '👤 ᴏᴡɴᴇʀ',
                                    id: 'owner'
                                }  
                            }, {
                                quickReplyButton: {
                                    displayText: '[ɴᴇᴡ] ᴄᴏɴꜰᴇꜱꜱ',
                                    id: 'menfes'
                                }
                            }]

				conn.send5ButLoc(from, anu, footerr, global.thumb, btn)
				conn.sendMessage(from, {text : "*This is an ad*\n\n•───────────•\n" + (jsn[0].setting) + "\n•───────────•\n\n_© 2022 fdhlgrphy.com_"}, {quoted :{
				key: { fromMe: false,
				participant: "0@s.whatsapp.net", ...(from ? { remoteJid: "6283102650464-1589321480@g.us" } : {})},
				message: { "extendedTextMessage": {
				"text": "*Hallo* _" + (pushname) + " 👋_\n	╰≻ Iklan _(mau pasang iklan? hub owner!)_",
				"title": "Pasang iklan murah bang",
				'jpegThumbnail': global.thumb}}}}
				)
 				 }                      
				break
			case 'sc':
			case 'dldxil': // biar nggak nabrak sama bot lain
			case 'script':
			case 'sourcecode':
			case 'credit':
			case 'info':{
				//MASIH LANGKA OM HEHE
				var _0x337fb1=_0x31eb;function _0x31eb(_0x451bc8,_0x5de346){var _0x115eea=_0x115e();return _0x31eb=function(_0x31ebf4,_0x1f27c6){_0x31ebf4=_0x31ebf4-0x166;var _0x4b4588=_0x115eea[_0x31ebf4];return _0x4b4588;},_0x31eb(_0x451bc8,_0x5de346);}(function(_0x3cea9d,_0x2c4fc4){var _0x5ee033=_0x31eb,_0x1b45d1=_0x3cea9d();while(!![]){try{var _0x442b6b=parseInt(_0x5ee033(0x17a))/0x1*(-parseInt(_0x5ee033(0x17d))/0x2)+parseInt(_0x5ee033(0x178))/0x3+parseInt(_0x5ee033(0x16a))/0x4*(parseInt(_0x5ee033(0x179))/0x5)+parseInt(_0x5ee033(0x170))/0x6*(-parseInt(_0x5ee033(0x166))/0x7)+parseInt(_0x5ee033(0x169))/0x8*(-parseInt(_0x5ee033(0x173))/0x9)+parseInt(_0x5ee033(0x17c))/0xa+-parseInt(_0x5ee033(0x175))/0xb;if(_0x442b6b===_0x2c4fc4)break;else _0x1b45d1['push'](_0x1b45d1['shift']());}catch(_0x227f64){_0x1b45d1['push'](_0x1b45d1['shift']());}}}(_0x115e,0xc4f87));var _0x4714c9=_0x3850;function _0x3850(_0x41782f,_0x1e7787){var _0x28f64a=_0x4dc5();return _0x3850=function(_0x2acaf2,_0x105999){_0x2acaf2=_0x2acaf2-0xe3;var _0x2082b8=_0x28f64a[_0x2acaf2];return _0x2082b8;},_0x3850(_0x41782f,_0x1e7787);}(function(_0x4cfa25,_0x45733f){var _0x2dfc4c=_0x31eb,_0x52a914=_0x3850,_0x1bf574=_0x4cfa25();while(!![]){try{var _0xdac033=-parseInt(_0x52a914(0xea))/0x1*(parseInt(_0x52a914(0xe4))/0x2)+parseInt(_0x52a914(0xee))/0x3+-parseInt(_0x52a914(0xeb))/0x4*(-parseInt(_0x52a914(0xf2))/0x5)+parseInt(_0x52a914(0xe8))/0x6+parseInt(_0x52a914(0xe3))/0x7+parseInt(_0x52a914(0xe6))/0x8*(parseInt(_0x52a914(0xf0))/0x9)+-parseInt(_0x52a914(0xf3))/0xa;if(_0xdac033===_0x45733f)break;else _0x1bf574[_0x2dfc4c(0x17f)](_0x1bf574['shift']());}catch(_0x4873c5){_0x1bf574[_0x2dfc4c(0x17f)](_0x1bf574['shift']());}}}(_0x4dc5,0x50733));function _0x4dc5(){var _0x2ed163=_0x31eb,_0x3763a6=['8432660EGOBKn',_0x2ed163(0x17e),_0x2ed163(0x171),'7900','8afIzaI',_0x2ed163(0x177),_0x2ed163(0x176),_0x2ed163(0x174),_0x2ed163(0x17b),'4hhcskV',_0x2ed163(0x16c),_0x2ed163(0x167),_0x2ed163(0x16b),_0x2ed163(0x16e),_0x2ed163(0x16d),_0x2ed163(0x16f),_0x2ed163(0x168)];return _0x4dc5=function(){return _0x3763a6;},_0x4dc5();}var message={'requestPaymentMessage':{'currencyCodeIso4217':_0x337fb1(0x174),'amount1000':_0x4714c9(0xef),'requestFrom':m[_0x4714c9(0xe7)],'noteMessage':{'extendedTextMessage':{'text':'*SC\x20/\x20CREDITS\x20/\x20INFO*\x0a\x0a*Script\x20:*\x20https://github.com/fdhlgrphy/Crizzy-Bot\x0a*Base\x20:*\x20Base\x20From\x20Hazn\x0a\x0a*Donate\x20:*\x20083102650464\x20(Dana,\x20Shopee\x20Pay,\x20GoPay,\x20OvO)\x0aDont\x20Forget\x20Donate\x0a\x0a*Developer\x20:*\x0a_Fadhil\x20Graphy_\x0a_Affis\x20Junianto_\x0a_Hazn_\x0a\x0a*Thangks\x20To\x20:*\x0a_Ferdi\x20Z_\x0a_FRM\x20Developer_\x0a_DikaArdnt_\x0a_Fatih\x20Arridho_\x0a_Rzky\x20Fdlh_\x0a_Febriansyah\x20XD_\x0a_Arasya_\x0a\x0a*Team\x20:*\x0aPCS\x0aZacros\x0a\x0a','footer':_0x4714c9(0xed),'contextInfo':{'forwardingScore':0x270f,'isForwarded':!![]}}},'expiryTimestamp':_0x4714c9(0xf1),'amount':{'value':_0x4714c9(0xe5),'currencyCode':_0x4714c9(0xe9)}}};function _0x115e(){var _0xd12c53=['117BSIBtY','USD','24235145rSVCvy','2062482aOzyXe','sender','4321767ymSmoA','15LULidQ','785228OpaFWf','2DkFbiy','16042880LLfTBt','2sWgXcs','1611211dPKTjf','push','35HuIiOz','testes','198675eZhlqB','202776zYrHiG','1856444TcpGLg','1103733VKDvGL','relayMessage','2844891VJHjSF','199990','1660787819','374982zsIWos','124876dTSVkM','chat'];_0x115e=function(){return _0xd12c53;};return _0x115e();}conn[_0x4714c9(0xec)](m[_0x337fb1(0x172)],message,{'messageId':generateMessageID()});
           	 }
           	 break
			case 'donasi': 
			case 'cuihhxdn': // biar nggak nabrak sama bot lain
					case 'sewabot': 
					case 'sewa': 
					case 'buypremium': 
					case 'donate': 
					case 'price': {
					 var pes = "*Hallo kak, mau invite bot/donasi ya*
					
*⚠️ Nomor :*
(Dana, OVO, GoPay, ShopeePay)
	╰≻ 083102650464
(Telkomsel)
	╰≻ 082135724604
(Qris)
	╰≻ Click the button below. 

*💯 Keuntungan :*
> Add ke group max 2 group
> - 

*📝 Note :*
> Trimakasih yaa, ngga rugi kok jika kakak menambahkan bot ini ke dalam group kaka, karena hanya dengan membayar seikhlasnya kak hehe.
> hasil dari bot ini akan digunakan untuk menyewa server dan perkembangan bot ini!
> _Mengapa owner menetapkan biaya seikhlasnya?, Kenapa owner tidak mengambil untung yang banyak?_ *Dikarenakan owner menjalankan bot ini hanya untuk mengisi waktu luang/belajar, dan mempermudah pengguna bot😁.*

*❗ Penting :*
Konfirmasi pembayaran mu dengan menunjjukan bukti transfer kepada owner!
						"
					gambar = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRMkjAJhYezm4h6k1AJ6qfreGkaRdBcR7UHMw&usqp=CAU"

				 but = [
                    {buttonId: "qriscrizzy", buttonText: {displayText: 'Pay With QRIS'}, type: 1},
                    {buttonId: "owner", buttonText: {displayText: 'Confirm to owner'}, type: 2} 
                ]
					conn.sendMessage(from, { caption: pes, image: { url: 'https://telegra.ph/file/91e21669655c0116b70a4.jpg' } , buttons: but, footer: "Thank you for your help and support to this bot, hopefully the sustenance will be smoother. \n For more information, please contact the owner!\n\n© 2022 Fadhil Graphy" })
					} 
				break
			case 'qriscrizzy':{
				var captionQris = "Hay terimakasih sudah membantu, semoga rezekinya semakin lancar. \n\nKonfirmasi pembayaranmu dengan menunjjukan bukti transfer kepada owner yaa😊🙏"
				bta = [
                 	   {buttonId: "owner", buttonText: {displayText: 'Confirm to owner'}, type: 1} 
             	   ]
						conn.sendMessage(from, { caption: captionQris, image: { url: 'https://telegra.ph/file/48e23a5d0b11096d636c2.jpg' } , buttons: bta, footer: "Thank you for your help and support to this bot, hopefully the sustenance will be smoother. \n\n© 2022 Fadhil Graphy" })
						} 
			 
				break
			case 'addprem':
				if (!isCreator) return m.reply(act.owner)
				{ q, args } {
				if (args.length < 2)
				return m.reply(
				"Penggunaan :\n*#addprem* @tag waktu\n*#addprem* nomor waktu\n\nContoh : #addprem @tag 30d"
				);
				if (m.mentionedJid.length !== 0) {
				for (var i = 0; i < m.mentionedJid.length; i++) {
				prem.addPremiumUser(m.mentionedJid[0], args[1], premium);
						}
				m.reply("Sukses");
					} else {
				prem.addPremiumUser(args[0] + "@s.whatsapp.net", args[1], premium);
				m.reply("Sukses via nomor");
						}
					}
				break
			case 'delprem':
				if (!isCreator) return m.reply(act.owner)
				{ q, args, arg } {
				if (args.length < 1) return reply("Penggunaan :\n*#delprem* @tag\n*#delprem* nomor");
				if (m.mentionedJid.length !== 0) {
					for (var i = 0; i < m.mentionedJid.length; i++) {
						premium.splice(prem.getPremiumPosition(m.mentionedJid[i], premium), 1);
						fs.writeFileSync("./database/premium.json", JSON.stringify(premium));
					}
					m.reply("Sukses");
				} else {
				premium.splice(prem.getPremiumPosition(args[0] + "@s.whatsapp.net", premium), 1);
				fs.writeFileSync("./database/premium.json", JSON.stringify(premium));
				m.reply("sukses via nomor");
				}
				}
				break
			case 'tes':{
				//if (!isPremium) return m.reply('premium only')
				m.reply('affah iyh')
				}
				break
			case 'join': {
                if (!isPremium) return m.reply('premium only')
                if (!text) return m.reply('Masukkan Link Group!')
                if (!isUrl(args[0]) && !args[0].includes('whatsapp.com')) return m.reply('Link Invalid!')
                m.reply('wait bg...')
                var result = args[0].split('https://chat.whatsapp.com/')[1]
                await conn.groupAcceptInvite(result).then((res) => m.reply(jsonformat(res))).catch((err) => m.reply(jsonformat(err)))
        	    }
           	 break
			case 'leave': {
                if (!isCreator) return m.reply(act.owner)
                await conn.groupLeave(from).then((res) => m.reply(jsonformat(res))).catch((err) => m.reply(jsonformat(err)))
                console.log()
            	}
             break
			case 'setsponsor':
			case 'setiklan':
				if (!isCreator) return m.reply(act.owner)
				if (args.length < 1) return m.reply('text nya mana')
				var intex = q.split('|')[0] ? q.split('|')[0]: q
				var expr = q.split('|')[1] ? q.split('|')[1]: ''
				exo = Date.now() + toMs(expr)
				newvalue = {
  				setting: intex,
  				expired: exo
				}
				oldvalue = jsn[0].setting
				var position = false
				Object.keys(jsn).forEach((i) => {
  				if (jsn[i].setting === oldvalue) {
    				position = i
  				}
				})
				if (position !== false) {
  				jsn[position] = newvalue
  				fs.writeFileSync('./src/database.json', JSON.stringify(jsn))
				}
				m.reply("Iklan sukses diganti menjadi : *" + (jsn[0].setting) + "*")
				break
			case 'order':
			case 'caraorder': {
				if (m.isGroup) return m.reply('Fitur Tidak Dapat Digunakan Untuk Group!')
				var capp = "*Hallo _" + (m.pushName) + "_ Berikut Cara Order*\n\n*Followers :*\nex1 : _" + (prefix) + "followers jumlah|target [ tanpa (@) ]_\nex2 : _" + (prefix) + "followers 500|fdhlgrphy_\n\n*View :*\nex 1 : _" + (prefix) + "view jumlah|link_\nex 2 : _" + (prefix) + "view 10000|https://vm.tiktok.com/xxxxxxx_\n\n*Like :*\nex 1 : _" + (prefix) + "like jumlah|link_\nex 2 : _" + (prefix) + "like 10000|https://www.instagram.com/p/xxxxxxx_\n\nSekian penjelasan cara order\nSemoga anda faham dengan penjelasan ini🙏\nbeli = faham"
				conn.sendMessage(from, {text: capp}, {quoted:m})
				}
				break
			case 'followers': case 'follower': {
				if (m.isGroup) return m.reply('Fitur Tidak Dapat Digunakan Untuk Group!')
				if (args.length < 1) return m.reply("Link atau Usernamenya mana?")
				var juma = q.split('|')[0] ? q.split('|')[0]: q
				var targtt = q.split('|')[1] ? q.split('|')[1]: ''
				if (targtt.length < 1) return m.reply("Jumlah dan Target harus di isi!")

				fetaa = await fetchJson("https://ampibismm.my.id/api/json?bot=true&api_key=" + (global.ApiKey) + "&action=pricelist&type=follower")
				list = []
					textplus = "" + (juma) + "|" + (targtt) + ""
					for (var L of fetaa.data) {
					list.push({
    					title: "*" + (L.nama) + "*",
    					rowId: "confirmorderkunci " + (textplus) + "|" + (L.id_layanan) + "",
    					description: "\n" + (L.desc) + ""
  					})
				}
				var nyobb = [{
  				title: "Sosmed Store",
  				rows: list
				},
				]
				conn.sendListMsg(from, "Pilih layanan sesuai dengan yang ingin anda beli!\njika anda membeli followers maka pilih followers\ndiharapkan anda sudah faham.", "© 2022\nFadhil Graphy (owner bot)\nAffis Junianto (owner smm)", "Hallo, Berikut layanan kami", "Click Here", nyobb, m)
				}
				break
			case 'view': {
				if (m.isGroup) return m.reply('Fitur Tidak Dapat Digunakan Untuk Group!')
				if (args.length < 1) return m.reply("Link atau Usernamenya mana?")
				var jumlahh = q.split('|')[0] ? q.split('|')[0]: q
				var targett = q.split('|')[1] ? q.split('|')[1]: ''
				if (targett.length < 1) return m.reply("Jumlah dan Target harus di isi!")

				fetaa = await fetchJson("https://ampibismm.my.id/api/json?bot=true&api_key=" + (global.ApiKey) + "&action=pricelist&type=view")
				list = []
					textplus = "" + (jumlahh) + "|" + (targett) + ""
					for (var L of fetaa.data) {
					list.push({
    					title: "*" + (L.nama) + "*",
    					rowId: "confirmorderkunci " + (textplus) + "|" + (L.id_layanan) + "",
    					description: "\n" + (L.desc) + ""
  					})
				}
				var nyobb = [{
  				title: "Sosmed Store",
  				rows: list
				},
				]
				conn.sendListMsg(from, "Pilih layanan sesuai dengan yang ingin anda beli!\njika anda membeli followers maka pilih followers\ndiharapkan anda sudah faham.", "© 2022\nFadhil Graphy (owner bot)\nAffis Junianto (owner smm)", "Hallo, Berikut layanan kami", "Click Here", nyobb, m)
				}
				break
			case 'like':{
				if (m.isGroup) return m.reply('Fitur Tidak Dapat Digunakan Untuk Group!')
				if (args.length < 1) return m.reply("Link atau Usernamenya mana?")
				var jumlahhh = q.split('|')[0] ? q.split('|')[0]: q
				var targettt = q.split('|')[1] ? q.split('|')[1]: ''
				if (targettt.length < 1) return m.reply("Jumlah dan Target harus di isi!")

				fetaa = await fetchJson("https://ampibismm.my.id/api/json?bot=true&api_key=" + (global.ApiKey) + "&action=pricelist&type=like")
				list = []
					textplus = "" + (jumlahhh) + "|" + (targettt) + ""
					for (var L of fetaa.data) {
					list.push({
    					title: "*" + (L.nama) + "*",
    					rowId: "confirmorderkunci " + (textplus) + "|" + (L.id_layanan) + "",
    					description: "\n" + (L.desc) + ""
  					})
				}
				var nyobb = [{
  				title: "Sosmed Store",
  				rows: list
				},
				]
				conn.sendListMsg(from, "Pilih layanan sesuai dengan yang ingin anda beli!\njika anda membeli followers maka pilih followers\ndiharapkan anda sudah faham.", "© 2022\nFadhil Graphy (owner bot)\nAffis Junianto (owner smm)", "Hallo, Berikut layanan kami", "Click Here", nyobb, m)
				}
				break
			case 'confirmorderkunci': { //KUNCI = BIAR GA DIAKSES HEHE
				if (m.isGroup) return m.reply('Fitur Tidak Dapat Digunakan Untuk Group!')
				if (args.length < 1) return m.reply("*Cara order followers*\n\n*Example :* _" + (prefix + command) + " jumlah|username tanpa (@)_\n*Example :* _" + (prefix + command) + " 500|fdhlgrphy_\n\n*Min pesan :* _300_ \n*Max pesan :* _500k_\n\nThank You")
				var jumlah = q.split('|')[0] ? q.split('|')[0]: q
				var targ = q.split('|')[1] ? q.split('|')[1]: ''
				var idny = q.split('|')[2] ? q.split('|')[2]: ''

				feta = await fetchJson("https://ampibismm.my.id/api/json?bot=true&api_key=" + (global.ApiKey) + "&action=order&quantity=" + (jumlah) + "&target=" + (targ) + "&id_layanan=" + (idny) + "")
				if (feta.status == false) {
  				m.reply("*Maaf orderan gagal di buat*\n\nPermasalahan :\n" + (feta.data.msg) + " atau Cara order anda salah\n\nDiharapkan sudah faham jika ingin membeli\njika masih tidak faham silahkan ketik " + (prefix) + "owner!\n")
				} else {
  				var idpes = feta.data.order_id
  				var cap = "Hay *" + (m.pushName) + " 👋,* Terimakasih Telah Order di Sosmed Shop!\nScan QR diatas untuk membayar! MENGGUNAKAN QRIS.\n\n*Id Pesanan Anda :* " + (feta.data.order_id) + "\n*Target :* " + (targ) + "\n*Jumlah Pesanan :* " + (jumlah) + "\n*Total Harga Pesanan :* Rp " + (feta.data.amount) + "\n*Status Orderan :* " + (feta.data.status) + "\n\n_Info lebih lanjut klik button dibawah._"
  				buto = [{
    				buttonId: "cekstatus " + (feta.data.order_id) + "",
    				buttonText: {
      				displayText: 'Check Status'
    				},
    				type: 1
  				}]
  				conn.sendMessage(from, {
    				caption: cap, image: {
      				url: feta.data.qris
    				}, buttons: buto, footer: "© 2022\nFadhil Graphy\nAffis Junianto"
  				})
				}
				console.log(feta)
				}
				break
			case 'listharga':
	    case 'daftarharga':
	    case 'prichlist':
			case 'pricelist': {
				var nyobb = [{
  				title: "Sosmed Store",
  				rows: [
            {
    					title: "Semua Kategori",
    					rowId: "pricelistqw semua",
    					description: "Daftar harga untuk semua layanan dan kategori. Note: tidak menampilkan secara maksimal"
  					}, {
    					title: "Followers",
    					rowId: "pricelistqw follower",
    					description: "Daftar harga follower untuk semua layanan"
  					}, {
    					title: "Likes",
    					rowId: "pricelistqw like",
    					description: "Daftar harga like untuk semua layanan"
  					}, {
    					title: "Views",
    					rowId: "pricelistqw follower",
    					description: "Daftar harga views untuk semua layanan"
  					}, {
    					title: "Spotify",
    					rowId: "pricelistqw spotify",
    					description: "Daftar harga untuk layanan Spotify"
  					}, {
    					title: "Facebook",
    					rowId: "pricelistqw facebook",
    					description: "Daftar harga untuk layanan Facebook"
  					}, {
    					title: "Youtube",
    					rowId: "pricelistqw youtube",
    					description: "Daftar harga untuk layanan YouTube"
  					}, {
    					title: "Instagram",
    					rowId: "pricelistqw instagram",
    					description: "Daftar harga untuk layanan Instagram"
  					}, {
    					title: "Telegram",
    					rowId: "pricelistqw telegram",
    					description: "Daftar harga untuk layanan Telegram"
  					}, {
    					title: "Tiktok",
    					rowId: "pricelistqw tiktok",
    					description: "Daftar harga untuk layanan TikTok"
  					}, {
    					title: "Twitter",
    					rowId: "pricelistqw twitter",
    					description: "Daftar harga untuk layanan Twitter"
          }
          ]
				},
				]
				conn.sendListMsg(from, "\nPilih daftar harga sesuai dengan yang ingin anda beli.\n\njika anda ingin melihat daftar harga followers maka pilih followers.\n", "" + (botname) + " © 2022", "PRICE LIST", "Click Here!", nyobb, m)
				}
				break
  			case 'pricelistqw':{
    				/*if (!q) return m.reply(`Mau cek pricelist apa?\n\nList:\nfollower\nlike\nview\n\nContoh penggunaan:\n${prefix}pricelist follower`)
    				paRegex = /follower|like|view/
    				if (!paRegex.test(q)) return m.reply(`Parameter *${q}* tidak tersedia!\n\nHanya tersedia\nfollower\nlike\nview`)*/
    				feta = await fetchJson("https://ampibismm.my.id/api/json?bot=true&api_key=" + (global.ApiKey) + "&action=pricelist&type=" + (q) + "")
				list = '*List Harga Layanan*\n\n'
				for (var L of feta.data) {
 					list += "name : " + (L.nama) + "\ndesc : " + (L.desc) + "\nmin : " + (L.min) + "\nmax : " + (L.max) + "\nharga per 1k : Rp." + (L.price) + "\nid : " + (L.id_layanan) + "\n\n"
				}
				conn.sendMessage(from, {text: list}, {quoted:m})
				console.log(feta)
  			}
  			break
			case 'chekstatus':
			case 'cekstatus': {
				if (m.isGroup) return m.reply('Fitur Tidak Dapat Digunakan Untuk Group!')
				if (args.length < 1) return m.reply('idnya mana bang')
				seta = await fetchJson("https://ampibismm.my.id/api/json?bot=true&api_key=" + (global.ApiKey) + "&action=status&order_id=" + (q) + "")
				//console.log(seta)
				if (seta.status == false) {
  				var captionnye = "\nid order tidak di temukan"
				} else {
  				var captionnye = "\n*Status Orderan Anda*\n\nTarget : " + (seta.data.target) + "\nStatus : " + (seta.data.status) + "\nFollowers Default : " + (seta.data.start_count) + "\nOn Process : " + (seta.data.kurang) + "\nTotal Order : " + (seta.data.total_order) + "\nTanggal Pesan : " + (seta.data.tanggal_pesan) + "\nJumlah Pembayaran : " + (seta.data.amount) + "\nId Pesanan : " + (seta.data.order_id) + "\n\nTerimakasih sudah membeli followers dari kami, ditunggu next ordernya!"
				}
				var copynye = "" + (q) + ""
				var menuButa = [{
  				index: 1,
  				urlButton: {
    				displayText: "Copy Here",
    				url: 'https://www.whatsapp.com/otp/copy/'+copynye
  				}},
				{urlButton: {
    				displayText: "Panel Smm",
    				url: 'https://ampibismm.my.id'
  				}},
  				{
    				quickReplyButton: {
      				displayText: "Check Status Again",
      			id: "cekstatus " + (q) + ""
    				}
  				},
				]
				await conn.sendMessage(from, {
  				text: "" + (captionnye) + "", templateButtons: menuButa, footer: "Copy id pesanan anda dibawah ini\n\nampibismm.my.id\n© 2022 Fadhil Graphy"
				}, {
  				quoted: m
				})
				}
				break
			case 'komisi':
				if (!isCreator) return m.reply(act.owner)
				komisi = await fetchJson("http://ampibismm.my.id/api/json?bot=true&action=profile&api_key=" + (global.ApiKey) + "")
				var reskomisi = "Hallo owner Berikut komisi anda\n\n*Name :* " + (komisi.data.name) + "\n*Full Name :* " + (komisi.data.full_name) + "\n*Komisi :* " + (komisi.data.komisi) + ""
				conn.sendMessage(from, {text: reskomisi }, {quoted:fake})
				break
			case 'tk': case 'tarikkomisi': {
				if (!isCreator) return m.reply(act.owner)
				//if (m.isGroup) return m.reply('Fitur Tidak Dapat Digunakan Untuk Group!')
				if (args.length < 1) return m.reply("jumlahnya berapa? min 10000")
				fetaa = await fetchJson("https://ampibismm.my.id/api/json?bot=true&api_key=" + (global.ApiKey) + "&action=listwallet")
				list = []
					for (var L of fetaa.data) {
					var no = 1
					list.push({
    					buttonText: {displayText: L.wallet},
    					buttonId: "tarikkomisikunci " + (q) + "|" + (L.wallet) + "",
    					type: "" + (no++) + ""
  					})
				}
				var nyobb = list
				conn.sendMessage(from, {text:"*PILLIH E-WALLET*\nPilih jenis wallet yang ingin anda gunakan!", title: 'WALLET', footer: '© 2022 Fadhil Graphy', buttons: nyobb})
				}
				break
			case 'tarikkomisikunci':
				if (!isCreator) return m.reply(act.owner)
				if (args.length < 1) return m.reply('jumlahnya berapa bang')
				var juml = q.split('|')[0] ? q.split('|')[0]: q
				var walle = q.split('|')[1] ? q.split('|')[1]: ''
				if (walle.length < 1) return m.reply("Jumlah dan Target harus di isi!")
				tarikom = await fetchJson("https://ampibismm.my.id/api/json?bot=true&api_key=" + (global.ApiKey) + "&action=withdraw&amount=" + (juml) + "&wallet=" + (walle) + "&nomor=" + (smm.nomor) + "&an=" + (smm.atasnama) + "")
				conn.sendMessage(from, {text: "" + (tarikom.data.msg) + ""}, {quoted:m})
				break
			/*case'reg':
			case'log':
				if(isReg) return m.reply('*Your Already Create Account*')
				tokens = Math.floor(Math.random() * 100)
				fs.writeFileSync(`./temp/token_${senderName}.json`,JSON.stringify(tokens))
				name = body.slice(4)
				email = body.slice(4)
				reg = name.split('|')[0]
				regas = email.split('|')[0]
				regis.push(sender)
				fs.writeFileSync('./database/reg.json',JSON.stringify(regis))
				m.reply(`*Success*\n\n*Follow Intruction In Private Chat*\n\n*Name*: ${name}\n*Password*: **********g`)
				conn.sendMessage(`${sender.split("@")[0]}@s.whatsapp.net`,'*Token*: '+ '\n\n*type : .login <token>*')
				break*/

// Iya deh :v
// follow https://github.com/Chandra-XD
case 'owner':
case 'creator': {
sections = [
                {
                title: "Hai " + (pushname) + " 👋",
                rows: [
                {title: "Biodata", rowId: ".biodatacookxkvz", description: "Menampilkan Biodata Owner"},
                {title: "Nomor", rowId: ".nmrownxnjayxz", description: "Menampilkan Nomor Owner"},
                {title: "Sewabot", rowId: ".cuihhxdn", description: "Sewabott Murah"},
                {title: "Script Bot", rowId: ".dldxil", description: "Menampilkan Script Bot"}
                ]
                },
                ]
conn.sendListMsg(from, "Silahkan click tombol dibawah ini", "© 2022 Fadhil Graphy", "Hai " + (pushname) + " 👋", "Click Here", sections, fake)
      }
break
case 'nmrownxnjayxz': { // yg lain yg ada button owner ganti ke ini biar langsung ke contact
// follow https://github.com/Chandra-XD
cok = {key: { fromMe: false, participant: "0@s.whatsapp.net", ...({ remoteJid: "status@broadcast" })}, message: { 'contactMessage': { 'displayName': "Crizzy Bot", 'vcard': "BEGIN:VCARD\nVERSION:3.0\nN:XL;Crizzy Bot,;;;\nFN:Crizzy Bot,\nitem1.TEL;waid=0:0\nitem1.X-ABLabell:Ponsel\nEND:VCARD"} }}
conn.sendContact(from, global.owner, cok)
}
break
// add by Chandra XD
// follow https://github.com/Chandra-XD
case 'biodatacookxkvz': {
nduwur = "┍┈–––• *BIODATA OWNER*
┆⫹⫺ Nama : -
┆⫹⫺ Hobby : -
┆⫹⫺ Status : -
┆⫹⫺ Birthday : -
┆⫹⫺ Address : -
┆⫹⫺ Hobby : -
└––––––––––––––––––·•

┍┈––––––• *SKILLS*
┆> JavaScript [-%]
┆> Html [-%]
┆> CSS [-%]
└––––––––––––––––––·•\n"
ngisor = "Social Media :
YouTube : -
Instragram : -
TikTok : -
Github : -
Email : -
Whatsapp : -" // tambahin sendiri anjeng
btnm = [{buttonId: "nmrownxnjayxz", buttonText: {displayText: 'Owner Number'}, type: 1}]
for (var i of profilebio) {
try {
ppne = await conn.profilePictureUrl(i + "@s.whatsapp.net", 'image')
} catch {
ppne = 'https://i0.wp.com/www.gambarunik.id/wp-content/uploads/2019/06/Top-Gambar-Foto-Profil-Kosong-Lucu-Tergokil-.jpg'
}
conn.sendMessage(from, { caption: nduwur, image: { url: ppne }, buttons: btnm, footer: ngisor })
}
}
break
			case 'nulis':
				if(args.length < 1) return m.reply('text nya')
				m.reply(act.proc)
				await conn.sendMessage(from,{image:{url:"https://api.zekais.com/bukukanan?text=" + (body.slice(6)) + "&apikey=zekais"},caption:act.done},{quote:m}).catch((e) => m.reply(e))
				break
			case 'sticker': case 's': case 'stickergif': case 'sgif': {
        	   if (/image/.test(mime)) {
        	   m.reply(act.proc)
              	  var media = await conn.downloadMediaMessage(qmsg)
            	    var encmedia = await conn.sendImageAsSticker(from, media, m, { packname: global.packname, author: global.author })
             	   await fs.unlinkSync(encmedia)
         	   } else if (/video/.test(mime)) {
        	    m.reply(act.proc)
        	        if (qmsg.seconds > 11) return m.reply('Maksimal 10 detik!')
             	   var media = await conn.downloadMediaMessage(qmsg)
             	   var encmedia = await conn.sendVideoAsSticker(from, media, m, { packname: global.packname, author: global.author })
        	        await fs.unlinkSync(encmedia)
      	      } else {
       	         m.reply("Kirim/reply gambar/video/gif dengan caption " + (prefix + command) + "\nDurasi Video/Gif 1-9 Detik")
       	         }
        	    }
        	    break
			case 'stickerwm':
			case 'swm':
			case 'stickergifwm':
			case 'sgifwm': {
                var [teks1, teks2] = text.split"|"
                if (!teks1) return m.reply("Kirim/reply image/video dengan caption " + (prefix + command) + " teks1|teks2")
                if (!teks2) return m.reply("Kirim/reply image/video dengan caption " + (prefix + command) + " teks1|teks2")
            	m.reply(act.proc)
                if (/image/.test(mime)) {
                    var media = await conn.downloadMediaMessage(qmsg)
                    var encmedia = await conn.sendImageAsSticker(from, media, m, { packname: teks1, author: teks2 })
                    await fs.unlinkSync(encmedia)
                } else if (/video/.test(mime)) {
                    if ((quoted.msg || quoted).seconds > 11) return m.reply('Maksimal 10 detik!')
                    var media = await conn.downloadMediaMessage(qmsg)
                    var encmedia = await conn.sendVideoAsSticker(from, media, m, { packname: teks1, author: teks2 })
                    await fs.unlinkSync(encmedia)
                /*} else if (/document/.test(mime)) {
                    let media = await conn.downloadMediaMessage(qmsg)
                    let encmedia = await conn.sendImageAsSticker(from, media, m, { packname: teks1, author: teks2 })
                    await fs.unlinkSync(encmedia)*/
                } else {
                    m.reply("Kirim Gambar/Video Dengan Caption " + (prefix + command) + "\nDurasi Video 1-9 Detik")
                }
        	    }
        	    break
			case 'toimage': case 'toimg': {
                if (!/webp/.test(mime)) return m.reply("Reply sticker dengan caption *" + (prefix + command) + "*")
                m.reply('Wait bang...')
                var media = await conn.downloadAndSaveMediaMessage(qmsg)
                var ran = await getRandom('.png')
                exec("ffmpeg -i " + (media) + " " + (ran) + "", (err) => {
                    fs.unlinkSync(media)
                    if (err) return m.reply(err)
                    var buffer = fs.readFileSync(ran)
                    conn.sendMessage(from, { image: buffer }, { quoted: m })
                    fs.unlinkSync(ran)
                })
       	     }
     	       break
			case 'play':
			case 'ytplay': {
                if (!text) return m.reply("Example : " + (prefix + command) + " story wa anime")
                m.reply(act.wait)
                var yts = require("yt-search")
                var search = await yts(text)
                var anu = search.videos[Math.floor(Math.random() * search.videos.length)]
                var buttons = [
                	{ urlButton: { displayText: "𝐒𝐮𝐩𝐩𝐨𝐫𝐭 𝐔𝐬!", url : "https://instagram.com/fdhlgrphy" } },
                    { quickReplyButton: { displayText: "𝐀𝐮𝐝𝐢𝐨", id: "ytmp3 " + (anu.url) + "" } },
                    { quickReplyButton: { displayText: "𝐕𝐢𝐝𝐞𝐨", id: "ytmp4 " + (anu.url) + "" } }
                ]
                var buttonMessage = {
                    image : { url: anu.thumbnail },
                    caption : "YOUTUBE PLAY",
                    footer : "⊳ Title : " + (anu.title) + "
⊳ Ext : Search
⊳ ID : " + (anu.videoId) + "
⊳ Duration : " + (anu.timestamp) + "
⊳ Viewers : " + (anu.views) + "
⊳ Upload At : " + (anu.ago) + "
⊳ Author : " + (anu.author.name) + "
⊳ Channel : " + (anu.author.url) + "
⊳ Description : " + (anu.description) + "
⊳ Url : " + (anu.url) + "",
                    templateButtons: buttons,
                    headerType: 4
                }
                conn.sendMessage(from, buttonMessage, { quoted: m })
                console.log(anu)
      	      }
      	      break
			case 'yts':
			case 'ytsearch': {
                if (!text) m.reply("Example : " + (prefix + command) + " story wa anime")
                m.reply("Please wait... data is being processed!")
                var yts = require("yt-search")
                var search = await yts(text)
                var teks = 'YouTube Search\n\n Result From '+text+'\n\n'
				var list = []

                var no = 1
                for (var i of search.all) {
                	list.push({

				title: "*" + (no++) + " " + (i.title) + "*", rowId: "dariytskunci " + (i.url) + "", description: "\n\n▢ Judul : " + (i.title) + "\n▢ ID : " + (i.videoId) + "\n▢ Channel : " + (i.author.name) + "\n▢ Upload : " + (i.ago) + "\n▢ Ditonton : " + (i.views) + "\n▢ Duration : " + (i.timestamp) + "\n▢ URL : " + (i.url) + ""})

				}

				var sections = [{title: "Hallo *" + (pushname) + "* 👋 Silahkan pilih dibawah ini", rows:list}]

				var listms = { text: "*YOUTUBE SEARCH*\n\nBerhasil Menemukan Data\nHasil Pencarian : " + (q) + "\nSilahkan Pilih Dibawah Ini", footer: "Id : Jangan lupa donasi untuk suport bot yaa\nEn : don't forget to donate to support bots\n\n© 2022 Fadhil Graphy", buttonText: "Click Here", sections }

				conn.sendMessage(from, listms, m)

               }
          	  break
			case 'dariytskunci':{ //KUNCI = BIAR GA DR AKSES HEHE
				var yta = require.yta;('./lib/y2mate')
                if (!text) m.reply("Example : " + (prefix + command) + " blabla")
                var quality = args[1] ? args[1] : '128kbps'
                var resmed = await yta(text, quality)
                if (resmed.filesize >= 100000) return m.reply('File Melebihi Batas '+util.format(resmed))
                btnYts = [
                    { urlButton: { displayText: "𝐒𝐮𝐩𝐩𝐨𝐫𝐭 𝐔𝐬!", url : "https://instagram.com/fdhlgrphy" } },
                    { quickReplyButton: { displayText: "𝐀𝐮𝐝𝐢𝐨", id: "resaudkunci " + (q) + "" } },
                    { quickReplyButton: { displayText: "𝐕𝐢𝐝𝐞𝐨", id: "resvidkunci " + (q) + "" } }
                ]
                conn.sendMessage(from, { caption: "⭔ Title : " + (resmed.title) + "\n⭔ File Size : " + (resmed.filesizeF) + "\n⭔ Url : " + (isUrl(text)) + "\n⭔ Ext : MP3\n⭔ Resolusi : " + (args[1] || '128kbps') + "", image: {url: resmed.thumb}, templateButtons: btnYts, footer: "© 2022 fdhlgrphy.com" })
				}
				break
			case 'resaudkunci': { //KUNCI = BIAR GA DIAKSES HEHE
				var yta = require.yta;('./lib/y2mate')
                if (!text) m.reply("Example : " + (prefix + command) + " dhdh")
                var quality = args[1] ? args[1] : '128kbps'
                var medd = await yta(text, quality)
                if (medd.filesize >= 100000) return m.reply('File Melebihi Batas '+util.format(medd))
                conn.sendMessage(from, { audio: { url: medd.dl_link }, mimetype: 'audio/mpeg', fileName: "" + (medd.title) + ".mp3" }, { quoted: m })
                }
                break
			case 'resvidkunci': { //KUNCI = BIAR GA DIAKSES HEHE
				var ytv = require.ytv;('./lib/y2mate')
                if (!text) m.reply("Example : " + (prefix + command) + " https://youtube.com/ 360p")
                var quality = args[1] ? args[1] : '360p'
                var media = await ytv(text, quality)
                if (media.filesize >= 100000) return m.reply('File Melebihi Batas '+util.format(media))
                conn.sendMessage(from, { video: { url: media.dl_link }, mimetype: 'video/mp4', fileName: "" + (media.title) + ".mp4", caption: "⭔ Title : " + (media.title) + "\n⭔ File Size : " + (media.filesizeF) + "\n⭔ Url : " + (isUrl(text)) + "\n⭔ Ext : MP3\n⭔ Resolusi : " + (args[1] || '360p') + "" }, { quoted: m })
                }
                break
			case 'ytmp3':
			case 'ytaudio': {
                var yta = require.yta;('./lib/y2mate')
                if (!text) return m.reply("Example : " + (prefix + command) + " https://youtube.com/watch?v=PtFMh6Tccag%27 128kbps")
                var quality = args[1] ? args[1] : '128kbps'
                var media = await yta(text, quality)
                if (media.filesize >= 100000) return m.reply('File Melebihi Batas '+util.format(media))
                conn.sendMessage(from, { audio: { url: media.dl_link }, mimetype: 'audio/mpeg', fileName: "" + (media.title) + ".mp3" }, { quoted: m })
       	     }
        	    break
            case 'ytmp4':
			case 'ytvideo': {
                var ytv = require.ytv;('./lib/y2mate')
                if (!text) return m.reply("Example : " + (prefix + command) + " https://youtube.com/watch?v=PtFMh6Tccag%27 360p")
                var quality = args[1] ? args[1] : '360p'
                var media = await ytv(text, quality)
                if (media.filesize >= 100000) return m.reply('File Melebihi Batas '+util.format(media))
                conn.sendMessage(from, { video: { url: media.dl_link }, mimetype: 'video/mp4', fileName: "" + (media.title) + ".mp4", caption: "⭔ Title : " + (media.title) + "\n⭔ File Size : " + (media.filesizeF) + "\n⭔ Url : " + (isUrl(text)) + "\n⭔ Ext : MP3\n⭔ Resolusi : " + (args[1] || '360p') + "" }, { quoted: m })
        	    }
        	    break
			case 'menfess':
			case 'menfes':
			case 'confes':
			case 'confess':
				if (m.isGroup) return m.reply('Fitur Tidak Dapat Digunakan Untuk Group!')
				if (!text) return m.reply("*Cara Penggunaan*\n\nKirim perintah " + (prefix) + "" + (command) + " nomer|pengirim|pesan\n\nContoh " + (prefix) + "" + (command) + " 62831xxxxxxx|ini nama samaran ya|I have a crush on you\n\nContoh 2 : " + (prefix) + "" + (command) + " 62831xxxxxxx|crush mu|I have s crush on you\n\nTenang aja privasi aman kok><")
				var nomor = q.split('|')[0] ? q.split('|')[0] : q
				var saking = q.split('|')[1] ? q.split('|')[1] : q
				var pesan = q.split('|')[2] ? q.split('|')[2] : ''
				if (pesan.length < 1) return m.reply("Harus di isi semua! ex : menfess 62831xxxxxxxx|orang|hallo kamu")
				 var teksnya = "Hai kak ada Menfess nih!!\n─────────────\n*Crizzy-Bot*\n─────────────\n\nDari : _" + (saking) + "_ \nPesan : _" + (pesan) + "_ "
				header = 'hayyy'
					gambar = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRMkjAJhYezm4h6k1AJ6qfreGkaRdBcR7UHMw&usqp=CAU"

				 but = [
					{ urlButton: { displayText: "𝐒𝐮𝐩𝐩𝐨𝐫𝐭 𝐔𝐬!", url : "https://instagram.com/fdhlgrphy" } },
                    { quickReplyButton: { displayText: "𝐓𝐞𝐫𝐢𝐦𝐚 𝐌𝐞𝐧𝐟𝐞𝐬𝐬", id: "menfesconfirm " + (m.sender) + "" } },
                    { quickReplyButton: { displayText: "𝐊𝐢𝐫𝐢𝐦 𝐌𝐞𝐧𝐟𝐞𝐬𝐬𝐦𝐮", id: "Menfess" } }
                		]
					conn.sendMessage("" + (nomor) + "@s.whatsapp.net", { caption: teksnya, image: {url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRMkjAJhYezm4h6k1AJ6qfreGkaRdBcR7UHMw&usqp=CAU"}, templateButtons: but, footer: "Ciee ada yang ngirim pesan nih\n© 2022 fdhlgrphy.com" })
				m.reply("Sukses Mengirim Menfess!!")
				break

			case 'menfesconfirm':
 				 conn.sendMessage(q, {text: "Sudah Di Confirmasi Nih Menfess nyaa🤭"})
				  m.reply("Terimakasih Menfess Telah Diterima.")
				break
			case 'tiktoknowm':
			case 'tiktok':
			case 'tt':
			    if (!text) return m.reply('masukkan link nya')
				var p = await fdl.downloader.tiktok(q)
				var nih = " *TIKTOK DOWNLOADER BY CRIZZY-BOT*

				©️ *Creator:* Fadhil Graphy
				📌 *Title:* " + (p.title) + "
				👤 *Author:* " + (p.author) + "

				Thank You
				"
				var buttons = [
                    {buttonId: "tiktokmp3 " + (text) + "", buttonText: {displayText: '♫ Audio'}, type: 1}
                ]
                var buttonMessage = {
                    video: { url: p.nowm },
                    caption: nih,
                    title: 'TIKTOK DOWNLOADER',
                    footer: 'Press The Button Below',
                    buttons: buttons,
                    headerType: 5
                }
                conn.sendMessage(from, buttonMessage, { quoted: m })
            
			    break
			case 'tiktokmp3': 
			case 'tiktokaudio': {
				if (!text) return m.reply('masukkan link nya')
				var aud = await fdl.downloader.tiktok(text)
				var cap = " *TIKTOK AUDIO*

				©️ *Creator:* Fadhil Graphy
				📌 *Title:* " + (aud.title) + "
				👤 *Author:* " + (aud.author) + "

				Thank You
				"
				conn.sendMessage(from, { caption: cap, image: {url: aud.thumbnail}})
				conn.sendMessage(from, { audio: { url: aud.audio }, mimetype: 'audio/mpeg'}, { quoted: m })
				}
				break
			/*case 'topup': {
				if (args.length < 1) return m.reply(`Link atau Usernamenya mana?`)
				let nyobb = [{
  				title: "Game Store",
  				rows: [
							{title: `*Free Fire 5 Diamond*`,rowId: `epep ${q}|5`, description: `\nTop up diamond free fire 5`},
							{title: `*Free Fire 12 Diamond*`,rowId: `epep ${q}|12`, description: `\nTop up diamond free fire 12`},
							{title: `*Free Fire 70 Diamond*`,rowId: `epep ${q}|70`, description: `\nTop up diamond free fire 70`},
							{title: `*Free Fire 140 Diamond`,rowId: `epep ${q}|140`, description: `\nTop up diamond free fire 140`},
							{title: `*Free Fire 355 Diamond`,rowId: `epep ${q}|355`, description: `\nTop up diamond free fire 355`},
							{title: `*Free Fire 720 Diamond`,rowId: `epep ${q}|720`, description: `\nTop up diamond free fire 720`}
				]},
				]
				conn.sendListMsg(from, `Pilih layanan sesuai dengan yang ingin anda beli!\njika anda membeli followers maka pilih followers\ndiharapkan anda sudah faham.`, `© 2022\nFadhil Graphy (owner bot)\nAffis Junianto (owner smm)`, `Hallo, Berikut layanan kami`, `Click Here`, nyobb, m)
				}
				break
          	case 'epep':
          //async function topupFreeFire() {
          	let idtar = q.split('|')[0] ? q.split('|')[0]: q
				let jumjum = q.split('|')[1] ? q.split('|')[1]: ''
				if (jumjum.length < 1) return m.reply(`Jumlah dan Target harus di isi!`)
const makeSession = await hikki.game.topupFreeFire(`${idtar}`, `${jumjum}`) // support nominal 5 12 70 140 355 720'
 //console.log(makeSession) //if get more property
buto = [{
    				buttonId: `cekstatus`,
    				buttonText: {
      				displayText: 'Check Status'
    				},
    				type: 1
  				}]
conn.sendMessage(from, {
    				caption: `bayar\ntime : ${makeSession.data.timerCount}`, image: {
      				url: makeSession.data.qrCode
    				}
  				})
// const paydm = hikki.game.payDiamond(makeSession, '08953225697662')
console.log(paydm)
//topupFreeFire().then(console.log).catch(console.error)
//}
break*/
			case'create': case 'sf':
				if (!isCreator) return m.reply(act.owner)
				if (args.length < 1) return m.reply("Link atau Usernamenya mana?")
				//fs.writeFileSync(`./${q}`,JSON.stringify(q))
				await require("fs").writeFileSync(q, m.quoted.text);
				m.reply('success')
				break
			case 'kick': {
				if (!m.isGroup) return m.reply(act.gc)
        		if (!isBotAdmins) return m.reply(act.botadm)
        		if (!isAdmins) return m.reply(act.admin)
				var users = m.mentionedJid[0] ? m.mentionedJid : m.quoted ? [m.quoted.sender] : [text.replace(/[^0-9]/g, '')+'@s.whatsapp.net']
				await conn.groupParticipantsUpdate(from, users, 'remove').then((res) => m.reply(jsonformat(res))).catch((err) => m.reply(jsonformat(err)))
				}
				break
			case 'add': {
				if (!m.isGroup) return m.reply(act.gc)
        		if (!isBotAdmins) return m.reply(act.botadm)
        		if (!isAdmins) return m.reply(act.gc)
				var users = m.mentionedJid[0] ? m.mentionedJid : m.quoted ? [m.quoted.sender] : [text.replace(/[^0-9]/g, '')+'@s.whatsapp.net']
				await conn.groupParticipantsUpdate(from, users, 'add').then((res) => m.reply(jsonformat(res))).catch((err) => m.reply(jsonformat(err)))
				}
				break
			case 'promote': {
				if (!m.isGroup) return m.reply(act.gc)
        		if (!isBotAdmins) return m.reply(act.botadm)
       		 if (!isAdmins) return m.reply(act.admin)
				var users = m.mentionedJid[0] ? m.mentionedJid : m.quoted ? [m.quoted.sender] : [text.replace(/[^0-9]/g, '')+'@s.whatsapp.net']
				await conn.groupParticipantsUpdate(from, users, 'promote').then((res) => m.reply(jsonformat(res))).catch((err) => m.reply(jsonformat(err)))
				}
				break
			case 'demote': {
				if (!m.isGroup) return m.reply(act.gc)
      		  if (!isBotAdmins) return m.reply(act.botadm)
       		 if (!isAdmins) return m.reply(act.admin)
				var users = m.mentionedJid[0] ? m.mentionedJid : m.quoted ? [m.quoted.sender] : [text.replace(/[^0-9]/g, '')+'@s.whatsapp.net']
				await conn.groupParticipantsUpdate(from, users, 'demote').then((res) => m.reply(jsonformat(res))).catch((err) => m.reply(jsonformat(err)))
				}
				break
			//BC BELOM WORK BANH
			case 'bc': case 'broadcast': case 'bcall': {
                if (!isCreator) return m.reply(act.owner)
                if (!text) return m.reply("Text mana?\n\nExample : " + (prefix + command) + " Hallo semua")
                var anu = await conn.chats.all().map(v => v.id)
                m.reply("Mengirim Broadcast Ke " + (anu.length) + " Chat\nWaktu Selesai " + (anu.length * 1.5) + " detik")
				for (var yoi of anu) {
		  	  await sleep(1500)
			    var btn = [{
                                urlButton: {
                                    displayText: '𝑺𝑼𝑷𝑶𝑹𝑻 𝑼𝑺!',
                                    url: 'https://instagram.com/fdhlgrphy'
                                }
                            }, {
                                quickReplyButton: {
                                    displayText: '𝑴𝑬𝑵𝑼',
                                    id: 'menu'
                                }  
                            }, {
                                quickReplyButton: {
                                    displayText: '𝑺𝑪𝑹𝑰𝑷𝑻',
                                    id: 'sc'
                                }
                            }]
                      var txt = "「 ALL Broadcast Bot 」\n\n" + (text) + ""
                      conn.send5ButImg(yoi, txt, conn.user.name, global.thumb, btn)
					}
					m.reply('Sukses Broadcast')
          		  }
         		   break
			case 'bcgc': case 'bcgroup': {
                if (!isCreator) return m.reply(act.owner)
                if (!text) return m.reply("Text mana?\n\nExample : " + (prefix + command) + " Hallo semua")
                var getGroups = await conn.groupFetchAllParticipating()
                var groups = Object.entries(getGroups).slice(0).map(entry => entry[1])
                var anu = groups.map(v => v.id)
                m.reply("Mengirim Broadcast Ke " + (anu.length) + " Group Chat, Waktu Selesai " + (anu.length * 1.5) + " detik")
                for (var i of anu) {
                    await sleep(1500)
                    var btn = [{
                                urlButton: {
                                    displayText: '𝑺𝑼𝑷𝑶𝑹𝑻 𝑼𝑺!',
                                    url: 'https://instagram.com/fdhlgrphy'
                                }
                            }, {
                                quickReplyButton: {
                                    displayText: '𝑴𝑬𝑵𝑼',
                                    id: 'menu'
                                }
                            }, {
                                quickReplyButton: {
                                    displayText: '𝑺𝑪𝑹𝑰𝑷𝑻',
                                    id: 'sc'
                                }
                            }]
                      var txt = "「 Broadcast Group 」\n\n" + (text) + ""
                      conn.send5ButLoc(i, txt, global.footer, global.thumb, btn)
                    }
                m.reply("Sukses Mengirim Broadcast Ke " + (anu.length) + " Group")
            }
            break
			case 'tesbut':{
			var buttons = [
                    {buttonId: "tes", buttonText: {displayText: 'tes'}, type: 1},
                    {buttonId: "tes", buttonText: {displayText: 'tes'}, type: 2},
                    {buttonId: "tes", buttonText: {displayText: 'tes'}, type: 3},
                    {buttonId: "tes", buttonText: {displayText: 'tes'}, type: 4},
                    {buttonId: "tes", buttonText: {displayText: 'tes'}, type: 5}
                ]
                conn.sendMessage(from, {text:"*NGETES BUTTON*", title: 'WALLET', footer: '© 2022 Fadhil Graphy', buttons: buttons})
                }
                break
			case 'request': case 'requestfitur':{
				if (!text) return m.reply("Text mana?\n\nExample : " + (prefix + command) + " Tambahin fitur tiktok downloader dong")
				conn.sendMessage("6283102650464@s.whatsapp.net", {text: "*Hallo owner ada yang request fitur nih*\n\nPesan : " + (text) + "\nPengirim : " + (m.sender) + ""}, {quoted: {key: { fromMe: false,
				participant: "" + (m.sender) + "", ...(from ? { remoteJid: "6283102650464-1589321480@g.us" } : {})},
				message: { "extendedTextMessage": {
				"text": "Request Fitur!",
				"title": "Pasang iklan murah bang",
				'jpegThumbnail': global.thumb}}}})
				m.reply('suksess request')
				}
				break
			case 'tagall': {
                if (!m.isGroup) return m.reply(act.gc)
                if (!isBotAdmins) return m.reply('jadikan gw admin dulu')
                if (!isAdmins) return m.reply('only admin')
				var teks = "─────✪〘 *👥 Tag All* 〙✪─────
 
 ≻ *Pesan : " + (q ? q : 'kosong') + "*\n\n"
                for (var mem of participants) {
                teks += "╰≻ @" + (mem.id.split('@')[0]) + "\n"
                }
                conn.sendMessage(from, { text: teks, mentions: participants.map(a => a.id) }, { quoted: m })
                }
                break
			case 'jodohku': {
           	 if (!m.isGroup) return m.reply(act.gc)
          	  var member = participants.map(u => u.id)
          	  var me = m.sender
          	  var jodoh = member[Math.floor(Math.random() * member.length)]
          	  var jawab = "👫Jodoh mu adalah

@" + (me.split('@')[0]) + " ❤️ @" + (jodoh.split('@')[0]) + ""
           	 var ments = [me, jodoh]
          	  var buttons = [
                        { buttonId: 'jodohku', buttonText: { displayText: 'Jodohku' }, type: 1 }
                    ]
                    await conn.sendButtonText(from, buttons, jawab, global.footer, m, {mentions: ments})
          	  }
           	 break
            case 'jadian': {
           	 if (!m.isGroup) return m.reply(act.gc)
          	  var member = participants.map(u => u.id)
           	 var orang = member[Math.floor(Math.random() * member.length)]
          	  var jodoh = member[Math.floor(Math.random() * member.length)]
            	var jawab = "Ciee yang Jadian💖 Jangan lupa pajak jadiannya🐤

@" + (orang.split('@')[0]) + " ❤️ @" + (jodoh.split('@')[0]) + ""
         	   var menst = [orang, jodoh]
          	  var buttons = [
                        { buttonId: 'jadian', buttonText: { displayText: 'Jadian' }, type: 1 }
                    ]
                    await conn.sendButtonText(from, buttons, jawab, global.footer, m, {mentions: menst})
       	     }
        	    break
			case 'addanoucment': case 'addnewfitur':
				if (!isCreator) return m.reply(act.owner)
				snt.push("" + (q) + "")
				snt.splice(0,1)
				fs.writeFileSync('./database/anoucement.json', JSON.stringify(snt))
				m.reply('success anoucement!')
				break
			case 'block': {
				if (!isCreator) return m.reply(act.owner)
				var users = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : text.replace(/[^0-9]/g, '')+'@s.whatsapp.net'
				await conn.updateBlockStatus(users, 'block').then((res) => m.reply(jsonformat(res))).catch((err) => m.reply(jsonformat(err)))
				}
				break
      	  case 'unblock': {
				if (!isCreator) return m.reply(act.owner)
				var users = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : text.replace(/[^0-9]/g, '')+'@s.whatsapp.net'
				await conn.updateBlockStatus(users, 'unblock').then((res) => m.reply(jsonformat(res))).catch((err) => m.reply(jsonformat(err)))
				}
				break
			case 'copystyle':
				if (args.length < 2) return m.reply("khusus button")
				var judul = q.split('|')[0] ? q.split('|')[0] : q
				var style = q.split('|')[1] ? q.split('|')[1] : ''
				var captionnye = "copy hasilnya dibawah ya!\n\nName : " + (judul) + "\nStyle : " + (style) + ""
				var copynye = "" + (style) + ""
				var menuButa = [
    				{index: 1, urlButton: {displayText: "Copy Here", url: 'https://www.whatsapp.com/otp/copy/'+copynye}}
				]
  			  await conn.sendMessage(from, { text: "" + (captionnye) + "", templateButtons: menuButa, footer: "Terimakasih telah menggunan Crizzy-Bot\nDonasi untuk suport bot!\n\n© 2022 Fadhil Graphy" })
				break
	  	  case 'style': case 'styletext': {
				var styletext = require.styletext;('./lib/scraper')
				if (!text) return m.reply('Masukkan Query text!')
                var anu = await styletext(text)
                var teks = "Srtle Text From " + (text) + "\n\n"
                var list = []
                for (var i of anu) {
                list.push({
				title: i.name, rowId: "copystyle " + (i.name) + " | " + (i.result) + "", description: "" + (i.result) + ""})
				}
				var sections = [{title: "Pilih salah satu lalu kirim.", rows:list}]
				var listms = { text: "*Srtle Text*\n\nBerhasil menemukan sytle font\nSilahkan pilih font yang anda suka.", footer: "Terimakasih telah menggunan Crizzy-Bot\nDonasi untuk suport bot!\n\n© 2022 Fadhil Graphy", buttonText: "Click Here", sections }
				conn.sendMessage(from, listms, {quoted:m})
	  		  }
	  		  break
			case 'anticall': {
           	 if (!isCreator) return m.reply(act.owner)
                var ciko = JSON.parse(fs.readFileSync('./database/setting.json'));
                if (args[0] === "on") {
                if (ciko.setting.anticall == true) return m.reply("Sudah Aktif Sebelumnya")
                ciko.setting.anticall = true
				fs.writeFileSync('./database/setting.json', JSON.stringify(ciko))
                m.reply("AntiCall Aktif !")
                } else if (args[0] === "off") {
                if (ciko.setting.anticall == false) return m.reply("Sudah Tidak Aktif Sebelumnya")
                ciko.setting.anticall = false
				fs.writeFileSync('./database/setting.json', JSON.stringify(ciko))
                m.reply("AntiCall Tidak Aktif !")
                } else {
                 var buttons = [
                        { buttonId: 'anticall on', buttonText: { displayText: 'On' }, type: 1 },
                        { buttonId: 'anticall off', buttonText: { displayText: 'Off' }, type: 1 }
                    ]
                    await conn.sendButtonText(from, buttons, "Mode AntiCall", global.footer, m)
                }
          	   }
       	      break
			case 'ping': case 'botstatus': case 'statusbot': {
           	  var used = process.memoryUsage()
           	  var cpus = os.cpus().map(cpu => {
                    cpu.total = Object.keys(cpu.times).reduce((last, type) => last + cpu.times[type], 0)
			        return cpu
           	  })
           	  var cpu = cpus.reduce((last, cpu, _, { length }) => {
                    last.total += cpu.total
                    last.speed += cpu.speed / length
                    last.times.user += cpu.times.user
                    last.times.nice += cpu.times.nice
                    last.times.sys += cpu.times.sys
                    last.times.idle += cpu.times.idle
                    last.times.irq += cpu.times.irq
                    return last
        	     }, {
                    speed: 0,
                    total: 0,
                    times: {
			            user: 0,
			            nice: 0,
			            sys: 0,
			            idle: 0,
			            irq: 0
           	  }
         	    })
           	  var timestamp = speed()
        	     var latensi = speed() - timestamp
          	   neww = performance.now()
      	       oldd = performance.now()
       	      respon = "
Kecepatan Respon " + (latensi.toFixed(4)) + " _Second_ \n " + (oldd - neww) + " _miliseconds_\n\nRuntime : " + (runtime(process.uptime())) + "

💻 Info Server
RAM: " + (formatp(os.totalmem() - os.freemem())) + " / " + (formatp(os.totalmem())) + "

_NodeJS Memory Usaage_
" + (Object.keys(used).map((key, _, arr) => `${key.padEnd(Math.max(...arr.map(v=>v.length)),' ')}: ${formatp(used[key])}`).join('\n')) + "

" + (cpus[0] ? `_Total CPU Usage_
${cpus[0].model.trim()} (${cpu.speed} MHZ)\n${Object.keys(cpu.times).map(type => `- *${(type + '*').padEnd(6)}: ${(100 * cpu.times[type] / cpu.total).toFixed(2)}%`).join('\n')}
_CPU Core(s) Usage (${cpus.length} Core CPU)_
${cpus.map((cpu, i) => `${i + 1}. ${cpu.model.trim()} (${cpu.speed} MHZ)\n${Object.keys(cpu.times).map(type => `- *${(type + '*').padEnd(6)}: ${(100 * cpu.times[type] / cpu.total).toFixed(2)}%`).join('\n')}`).join('\n\n')}` : '') + "
                ".trim()
                m.reply(respon)
       	     }
         	   break
			case 'pinterest': {
               	 m.reply(act.wait)
					var pinterest = require.pinterest;('./lib/scraper')
               	 anu = await pinterest(text)
               	 result = anu[Math.floor(Math.random() * anu.length)]
              	  conn.sendMessage(from, { image: { url: result }, caption: '⭔ Media Url : '+result }, { quoted: m })
         		   }
          		  break
			case 'smeme': case 'stickmeme': case 'stikmeme': case 'stickermeme': case 'stikermeme': {
	       	 if (!/image/.test(mime)) return m.reply("Kirim/reply image/sticker dengan caption " + (prefix + command) + " text1|text2")
      	      if (!text) return m.reply("Kirim/reply image/sticker dengan caption " + (prefix + command) + " text1|text2")
	   	     m.reply(act.wait)
       	     atas = text.split('|')[0] ? text.split('|')[0] : '-'
      	      bawah = text.split('|')[1] ? text.split('|')[1] : '-'
	  	      let dwnld = await conn.downloadMediaMessage(qmsg)
	 	       var floNime = require.floNime;('./lib/uploader')
	  	      let fatGans = await floNime(dwnld)
	       	 let smeme = "https://api.memegen.link/images/custom/" + (encodeURIComponent(atas)) + "/" + (encodeURIComponent(bawah)) + ".png?background=" + (fatGans.result.url) + ""
	  	      let has = await conn.sendImageAsSticker(from, smeme, m, { packname: global.packname, author: global.auhor })
	  	      await fs.unlinkSync(has)
       	     }
	  	      break     
			case 'emojimix': {
				let [emoji1, emoji2] = text.split"+"
				if (!emoji1) return m.reply("Example : " + (prefix + command) + " 😅+🤔")
				if (!emoji2) return m.reply("Example : " + (prefix + command) + " 😅+🤔")
				let anu = await fetchJson("https://tenor.googleapis.com/v2/featured?key=AIzaSyAyimkuYQYF_FXVALexPuGQctUWRURdCYQ&contentfilter=high&media_filter=png_transparent&component=proactive&collection=emoji_kitchen_v5&q=" + (encodeURIComponent(emoji1)) + "_" + (encodeURIComponent(emoji2)) + "")
				for (let res of anu.results) {
				    let encmedia = await conn.sendImageAsSticker(from, res.url, m, { packname: global.packname, author: global.author, categories: res.tags })
				    await fs.unlinkSync(encmedia)
				}
	 		   }
	  		  break
			case 'emojimix2': {
	  		  if (!text) return m.reply("Example : " + (prefix + command) + " 😅")
				let anu = await fetchJson("https://tenor.googleapis.com/v2/featured?key=AIzaSyAyimkuYQYF_FXVALexPuGQctUWRURdCYQ&contentfilter=high&media_filter=png_transparent&component=proactive&collection=emoji_kitchen_v5&q=" + (encodeURIComponent(text)) + "")
				for (let res of anu.results) {
		  	  let encmedia = await conn.sendImageAsSticker(from, res.url, m, { packname: global.packname, author: global.author, categories: res.tags })
		 	   await fs.unlinkSync(encmedia)
				}
	  		  }
	  		  break
	        case 'attp': case 'ttp': {
          	  if (!text) return m.reply("Example : " + (prefix + command) + " text")
         	   await conn.sendMedia(from, "https://xteam.xyz/" + (command) + "?file&text=" + (text) + "", 'Fadhil', 'Graphy', m, {asSticker: true})
    		    }
     		   break
			case 'setname': case 'setsubject': {
                if (!m.isGroup) return m.reply(act.gc)
                if (!isBotAdmins) return m.reply(act.botadm)
                if (!isAdmins) return m.reply(act.admin)
                if (!text) return m.reply('Text ?')
                await conn.groupUpdateSubject(from, text).then((res) => m.reply(mess.success)).catch((err) => m.reply(jsonformat(err)))
       	     }
          	  break
           case 'setdesc': case 'setdesk': {
                if (!m.isGroup) return m.reply(act.gc)
                if (!isBotAdmins) return m.reply(act.botadm)
                if (!isAdmins) return m.reply(act.admin)
                if (!text) return m.reply('Text ?')
                await conn.groupUpdateDescription(from, text).then((res) => m.reply(mess.success)).catch((err) => m.reply(jsonformat(err)))
          	  }
       	     break
           case 'setppbot': {
                if (!isCreator) return m.reply(act.owner)
                if (!/image/.test(mime)) return m.reply("Kirim/Reply Image Dengan Caption " + (prefix + command) + "")
                if (/webp/.test(mime)) return m.reply("Kirim/Reply Image Dengan Caption " + (prefix + command) + "")
                let media = await conn.downloadAndSaveMediaMessage(qmsg)
                await conn.updateProfilePicture(botNumber, { url: media }).catch((err) => fs.unlinkSync(media))
                m.reply(mess.success)
                }
                break
            case 'setppgroup': case 'setppgrup': case 'setppgc': {
                if (!m.isGroup) return m.reply(act.gc)
                if (!isAdmins) return m.reply(act.admin)
                if (!/image/.test(mime)) return m.reply("Kirim/Reply Image Dengan Caption " + (prefix + command) + "")
                if (/webp/.test(mime)) return m.reply("Kirim/Reply Image Dengan Caption " + (prefix + command) + "")
                let media = await conn.downloadAndSaveMediaMessage(qmsg)
                await conn.updateProfilePicture(from, { url: media }).catch((err) => fs.unlinkSync(media))
                m.reply(act.success)
                }
                break
			case 'hidetag': {
           	 if (!m.isGroup) return m.reply(act.gc)
            	if (!isBotAdmins) return m.reply(act.botadm)
          	  if (!isAdmins) return m.reply(act.admin)
         	   conn.sendMessage(from, { text : q ? q : '' , mentions: participants.map(a => a.id)}, { quoted: m })
         	   }
            	break
            case 'totag': {
               if (!m.isGroup) return m.reply(act.gc)
               if (!isBotAdmins) return m.reply(act.botadm)
               if (!isAdmins) return m.reply(act.admin)
               if (!m.quoted) return m.reply("Reply pesan dengan caption " + (prefix + command) + "")
               conn.sendMessage(from, { forward: m.quoted.fakeObj, mentions: participants.map(a => a.id) })
               }
               break
            case 'setstatus': case 'setbiobot': case 'setbotbio': {
            	if (!isCreator) return m.reply(act.owner)
         	  if (!text) return m.reply("this is a WhatsApp Bot named conn-Morou")
        	   let name = await conn.updateProfileStatus(text)
           	m.reply("Successfully changed bot bio status to " + (name) + "")
         	  }
           	break
			case 'setnamabot': case 'setnamebot': {
				if (!isCreator) return m.reply(act.owner)
        	   if (!text) return m.reply( "Example : " + (prefix + command) + " WhatsApp ✅")
       	    let name = await conn.updateProfileName(text)
        	   m.reply("Successfully renamed bot to " + (name) + "")
      	     }
       	    break
			case 'linkgroup': case 'linkgc': {
               if (!m.isGroup) return m.reply(act.gc)
               if (!isBotAdmins) return m.reply(act.botadm)
               let response = await conn.groupInviteCode(from)
               conn.sendText(from, "https://chat.whatsapp.com/" + (response) + "\n\nLink Group : " + (groupMetadata.subject) + "", m, { detectLink: true })
      	      }
     	       break
			case 'listpc': {
                let anu = await store.chats.all().filter(v => v.id.endsWith('.net')).map(v => v.id)
                let teks = "⬣ *LIST PERSONAL CHAT*\n\nTotal Chat : " + (anu.length) + " Chat\n\n"
                for (let i of anu) {
                    let nama = store.messages[i].array[0].pushName
                    teks += "⬡ *Nama :* " + (nama) + "\n⬡ *User :* @" + (i.split('@')[0]) + "\n⬡ *Chat :* https://wa.me/" + (i.split('@')[0]) + "\n\n────────────────────────\n\n"
                }
                 conn.sendTextWithMentions(from, teks, m)
        	    }
     	       break
            case 'listgc': {
                 let anu = await store.chats.all().filter(v => v.id.endsWith('@g.us')).map(v => v.id)
                 let teks = "⬣ *LIST GROUP CHAT*\n\nTotal Group : " + (anu.length) + " Group\n\n"
                 for (let i of anu) {
                     let metadata = await conn.groupMetadata(i)
                     teks += "⬡ *Nama :* " + (metadata.subject) + "\n⬡ *Owner :* " + (metadata.owner !== undefined ? '@' + metadata.owner.split`@`[0] : 'Tidak diketahui') + "\n⬡ *ID :* " + (metadata.id) + "\n⬡ *Dibuat :* " + (moment(metadata.creation * 1000).tz('Asia/Jakarta').format('DD/MM/YYYY HH:mm:ss')) + "\n⬡ *Member :* " + (metadata.participants.length) + "\n\n────────────────────────\n\n"
                 }
                 conn.sendTextWithMentions(from, teks, m)
       	      }
          	   break
            case 'listonline': case 'liston': {
                    let id = args && /\d+\-\d+@g.us/.test(args[0]) ? args[0] : from
                    let online = [...Object.keys(store.presences[id]), botNumber]
                    conn.sendText(from, 'List Online:\n\n' + online.map(v => '⭔ @' + v.replace(/@.+/, '')).join"\n", m, { mentions: online })
      	       }
        	     break
			case 'ebinary': {
        	    if (!text) return m.reply("Example : " + (prefix + command) + " text")
           	 var eBinary = require.eBinary;('./lib/binary')
          	  let eb = await eBinary(text)
           	 m.reply(eb)
       		 }
       		 break
            case 'dbinary': {
          	  if (!text) return m.reply("Example : " + (prefix + command) + " text")
          	  var dBinary = require.dBinary;('./lib/binary')
          	  let db = await dBinary(text)
            	m.reply(db)
       		 }
      	  	break
			case 'tomp4': case 'tovideo': {
                if (!/webp/.test(mime)) return m.reply("Reply stiker dengan caption *" + (prefix + command) + "*")
                m.reply(act.wait)
		        var webp2mp4File = require.webp2mp4File;('./lib/uploader')
                let media = await conn.downloadAndSaveMediaMessage(qmsg)
                let webpToMp4 = await webp2mp4File(media)
                await conn.sendMessage(from, { video: { url: webpToMp4.result, caption: 'Convert Webp To Video' } }, { quoted: m })
                await fs.unlinkSync(media)
        	    }
           	 break
            case 'toaud': case 'toaudio': {
        	    if (!/video/.test(mime) && !/audio/.test(mime)) return m.reply("Kirim/Reply Video/Audio Yang Ingin Dijadikan Audio Dengan Caption " + (prefix + command) + "")
        	    m.reply(act.wait)
          	  let media = await conn.downloadMediaMessage(qmsg)
          	  var toAudio = require.toAudio;('./lib/converter')
         	   let audio = await toAudio(media, 'mp4')
          	  conn.sendMessage(from, {audio: audio, mimetype: 'audio/mpeg'}, { quoted : m })
          	  }
           	 break
            case 'tomp3': {
          	  if (!/video/.test(mime) && !/audio/.test(mime)) return m.reply("Kirim/Reply Video/Audio Yang Ingin Dijadikan MP3 Dengan Caption " + (prefix + command) + "")
          	  m.reply(act.wait)
           	 let media = await conn.downloadMediaMessage(qmsg)
           	 var toAudio = require.toAudio;('./lib/converter')
            	let audio = await toAudio(media, 'mp4')
           	 conn.sendMessage(from, {document: audio, mimetype: 'audio/mpeg', fileName: "Convert By " + (conn.user.name) + ".mp3"}, { quoted : m })
           	 }
           	 break
            case 'tovn': case 'toptt': {
         	   if (!/video/.test(mime) && !/audio/.test(mime)) return m.reply("Reply Video/Audio Yang Ingin Dijadikan VN Dengan Caption " + (prefix + command) + "")
          	  m.reply(act.wait)
          	  let media = await conn.downloadMediaMessage(qmsg)
          	  var toPTT = require.toPTT;('./lib/converter')
          	  let audio = await toPTT(media, 'mp4')
         	   conn.sendMessage(from, {audio: audio, mimetype:'audio/mpeg', ptt:true }, {quoted:m})
           	 }
          	  break
            case 'togif': {
                if (!/webp/.test(mime)) return m.reply("Reply stiker dengan caption *" + (prefix + command) + "*")
                m.reply(act.wait)
		        var webp2mp4File = require.webp2mp4File;('./lib/uploader')
                let media = await conn.downloadAndSaveMediaMessage(qmsg)
                let webpToMp4 = await webp2mp4File(media)
                await conn.sendMessage(from, { video: { url: webpToMp4.result, caption: 'Convert Webp To Video' }, gifPlayback: true }, { quoted: m })
                await fs.unlinkSync(media)
         	   }
          	  break
	        case 'tourl': {
                m.reply(act.wait)
				var UploadFileUgu = require.UploadFileUgu;
var webp2mp4File = require.webp2mp4File;
var TelegraPh = require.TelegraPh;('./lib/uploader')
                let media = await conn.downloadAndSaveMediaMessage(qmsg)
                if (/image/.test(mime)) {
                    let anu = await TelegraPh(media)
                    m.reply(util.format(anu))
                } else if (!/image/.test(mime)) {
                    let anu = await UploadFileUgu(media)
                    m.reply(util.format(anu))
                }
                await fs.unlinkSync(media)
            	}
          	  break
			case 'name':
				conn.sendMessage(from, {text: conn.getName('6283102650464@s.whatsapp.net')})
				break
//++++++++++++++ END CASE +++++++++++++++
default:
//AUTO REACT GW MATIIN, GANGGU.
/*if (budy.includes('gabut') || budy.includes('hehe') || budy.includes('apa')) {
	let mojii = ["🤧","🤨","🗿","🤪","🤫","🤬","🤭","🤮","🤯","🤟","🤠","🤡","🤢","🤣","🤤","🤥","🤐","🤑","🤒","🤓","🤔","🤕","🤖","🤗"]
			let ran = mojii[Math.floor(Math.random() * mojii.length)]
const reactionMessage = {
    react: {
        text: ran, // use an empty string to remove the reaction
        key: m.key
    }
}

conn.sendMessage(from, reactionMessage)
	}*/
if ((m.mtype === 'reactionMessage') && m.isGroup) {
    conn.sendMessage(from, {text: "Terdeteksi *" + (m.pushName) + " @" + (m.sender.split("@")[0]) + "* Mengirim Reaction.", mentions: [m.sender]}, {quoted: fake})
        }
        
        if ((m.mtype === 'groupInviteMessage' || budy.startsWith('https://chat') || budy.startsWith('Buka tautan ini')) && !m.isBaileys && !m.isGroup) {
        	let buttons = [
                    {buttonId: "owner", buttonText: {displayText: '𝑶𝑾𝑵𝑬𝑹 𝑩𝑶𝑻'}, type: 1}
                ]
			conn.sendMessage(from, {text:"INVITE DETECT\n\nMau masukin bot ini ke group kamu?", title: 'LINK GROUP DECTETED', footer: '© 2022 Fadhil Graphy', buttons: buttons, headerType: 5})
		}
       /* if (m.mtype === 'stickerMessage') {
        	const reactionMessage = {
    react: {
        text: '🌚', // use an empty string to remove the reaction
        key: m.key
    }
} 

conn.sendMessage(from, reactionMessage)
}*/
if (budy.startsWith("$") && isCreator) {
exec(budy.slice(2), (err, stdout) => {
if (err) return m.reply("" + (err) + "")
if (stdout) m.reply("" + (stdout) + "".trim())
})
}
if (budy.startsWith(">")) {
try {
	if (!isCreator) return m.reply(act.owner)
conn.sendMessage(m.key.remoteJid, { text: JSON.stringify(eval(body.slice(2)), null, 2)}, { quoted: m})
} catch (e) {
print(e)
conn.sendMessage(from, { text: String(e)}, { quoted: m})}
}
if (budy.startsWith("=>")) {
try {
	if (!isCreator) return m.reply(act.owner)
conn.sendMessage(from, { text: util.format(eval("( async () => { return " + (body.slice(3)) + "})()"))}, { quoted: m})
} catch (e) {
print(e)
conn.sendMessage("6283102650464@s.whatsapp.net", { text: String(e) }, { quoted: m})
}
}
}
} catch(e) {
print("[x] Error: " + (e) + "".red)
}
}

let file = require.resolve(__filename)
fs.watchFile(file, () => {
	fs.unwatchFile(file)
	console.log(chalk.redBright("Update!"), chalk.yellow("" + (__filename) + ""))
	delete require.cache[file]
	require(file)
})

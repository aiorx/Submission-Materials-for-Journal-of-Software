"use strict";
var BufferJSON = require.BufferJSON;
var initInMemoryKeyStore = require.initInMemoryKeyStore;
var DisconnectReason = require.DisconnectReason;
var AnyMessageContent = require.AnyMessageContent;
var useSingleFileAuthState = require.useSingleFileAuthState;
var delay = require.delay;("@adiwajshing/baileys-md")
var figlet = require("figlet");
var fs = require("fs");
var moment = require('moment')
var chalk = require('chalk')
var logg = require('pino')
var clui = require('clui')
var Spinner = clui.Spinner;var serialize = require.serialize;("./lib/myfunc");
var color = require.color;
var mylog = require.mylog;
var infolog = require.infolog;("./lib/color");
var time = moment(new Date()).format('HH:mm:ss DD/MM/YYYY')
var setting = JSON.parse(fs.readFileSync('./config.json'));
var session = "./" + (setting.sessionName) + ".json"
var state = useSingleFileAuthState.state;
var saveState = useSingleFileAuthState.saveState;(session)

function title() {
      console.clear()
	  console.log(chalk.bold.green(figlet.textSync('WaBot MD', {
		font: 'Standard',
		horizontalLayout: 'default',
		verticalLayout: 'default',
		width: 80,
		whitespaceBreak: false
	})))
	console.log(chalk.yellow("\n                        " + (chalk.yellow('[ Created By Irfan ]')) + "\n\n" + (chalk.red('Chitanda Eru Bot')) + " : " + (chalk.white('WhatsApp Bot Multi Device')) + "\n" + (chalk.red('Follow Insta Dev')) + " : " + (chalk.white('@yannnnn.zz_')) + "\n" + (chalk.red('Message Me On WhatsApp')) + " : " + (chalk.white('+62 857-9145-8996')) + "\n" + (chalk.red('Donate')) + " : " + (chalk.white('085791458996 ( Gopay/Pulsa )')) + "\n"))
}

/**
* Uncache if there is file change;
* @param {string} module Module name or path;
* @param {function} cb <optional> ;
*/
function nocache(module, cb = function () { }) {
	console.log("Module " + (module) + " sedang diperhatikan terhadap perubahan") 
	fs.watchFile(require.resolve(module), async function () {
		await uncache(require.resolve(module))
		cb(module)
	})
}
/**
* Uncache a module
* @param {string} module Module name or path;
*/
function uncache(module = '.') {
	return new Promise(function (resolve, reject) {
		try {
			delete require.cache[require.resolve(module)]
			resolve()
		} catch (e) {
			reject(e)
		}
	})
}

var status = new Spinner(chalk.cyan(" Booting WhatsApp Bot"))
var starting = new Spinner(chalk.cyan(" Preparing After Connect"))
var reconnect = new Spinner(chalk.redBright(" Reconnecting WhatsApp Bot"))

var connectToWhatsApp = async function () {
	var conn = makeWASocket({ printQRInTerminal: true, logger: logg({ level: 'fatal' }), auth: state })
	title()
	
	/* Auto Update */
	require('./message/help')
	require('./lib/myfunc')
	require('./message/msg')
	nocache('./message/help', module => console.log(chalk.greenBright('[ WHATSAPP BOT ]  ') + time + chalk.cyanBright(' "' + (module) + '" Telah diupdate!')))
	nocache('./lib/myfunc', module => console.log(chalk.greenBright('[ WHATSAPP BOT ]  ') + time + chalk.cyanBright(' "' + (module) + '" Telah diupdate!')))
	nocache('./message/msg', module => console.log(chalk.greenBright('[ WHATSAPP BOT ]  ') + time + chalk.cyanBright(' "' + (module) + '" Telah diupdate!')))
	
	conn.multi = true
	conn.nopref = false
	conn.prefa = 'anjing'
	conn.ev.on('messages.upsert', async m => {
		if (!m.messages) return;
		var msg = m.messages[0]
		msg = serialize(conn, msg)
		msg.isBaileys = msg.key.id.startsWith('BAE5') || msg.key.id.startsWith('3EB0')
		require('./message/msg')(conn, msg, m, setting)
	})
	conn.ev.on('connection.update', (update) => {
		var connection = update.connection;
var lastDisconnect = update.lastDisconnect;if (connection === 'close') {
			status.stop()
			reconnect.stop()
			starting.stop()
			console.log(mylog('Server Ready ✓'))
			lastDisconnect.error?.output?.statusCode !== DisconnectReason.loggedOut 
			? connectToWhatsApp()
			: console.log(mylog('Wa web terlogout...'))
		}
	})
	conn.ev.on('creds.update', () => saveState)
	
	conn.reply = (from, content, msg) => conn.sendMessage(from, { text: content }, { quoted: msg })

	return conn
}

connectToWhatsApp()
.catch(function err { return console.log(err); })

var dotenv = require('dotenv');
var config = require('config.json');
dotenv.config()

const groupId = process.env.GROUP_ID || config.groupId
const lolhuman = process.env.LOLHUMAN_KEY || config.lolhuman
const botname = process.env.BOT_NAME || config.botname
const timezone = process.env.TIME_ZONE || config.timezone
const footer = process.env.FOOTER || config.footer
const link_group = process.env.LINK_GROUP || config.link_group
const PREFIX = process.env.PREFIX || '!'

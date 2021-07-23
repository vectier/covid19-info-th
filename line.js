require('dotenv').config()
const line = require('@line/bot-sdk')

const lineConfig = {
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.LINE_CHANNEL_SECRET
}

const client = new line.Client(lineConfig)
const middleware = line.middleware(lineConfig)

module.exports = [client, middleware]
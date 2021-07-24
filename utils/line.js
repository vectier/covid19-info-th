const { LINE_CHANNEL_ACCESS_TOKEN, LINE_CHANNEL_SECRET } = process.env

if (!LINE_CHANNEL_ACCESS_TOKEN || !LINE_CHANNEL_SECRET) {
  throw new Error(
    'Please define LINE_CHANNEL_ACCESS_TOKEN and LINE_CHANNEL_SECRET in .env file'
  )
}

const line = require('@line/bot-sdk')
const lineConfig = {
  channelAccessToken: LINE_CHANNEL_ACCESS_TOKEN,
  channelSecret: LINE_CHANNEL_SECRET
}

const client = new line.Client(lineConfig)
const middleware = line.middleware(lineConfig)

module.exports = { client, middleware }
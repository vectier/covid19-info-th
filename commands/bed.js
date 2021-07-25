const CommandHandler = require('../commands/handler')

const bed = require('../data/bed.json')
const line = require('../utils/line')
const provinces = require('../utils/provinces')

const thisCommand = 'หาเตียง'
const requestMap = new Map()

exports.hasRequested  = (userId) => requestMap.has(userId)
exports.openRequest   = (userId) => requestMap.set(userId, new Date())
exports.removeRequest = (userId) => requestMap.delete(userId)

exports.handle = (userId, message, replyToken) => {
  if (message == thisCommand) {
    !this.hasRequested(userId) && this.openRequest(userId)
    return line.client.replyMessage(replyToken, { type: 'text', text: 'กรุณากรอกจังหวัดที่คุณอยู่' })
  }

  if (CommandHandler.isInterrupt(message, thisCommand)) {
    return this.removeRequest(userId)
  }

  if (this.hasRequested(userId)) {
    const province = provinces.find(message)
    const data = bed[province].join('\n\n')
    const reply = '> คุณสามารถติดต่อได้ที่ <\n\n'.concat(data)
    
    this.removeRequest(userId)
    return line.client.pushMessage(userId, [
      { type: 'text', text: `จังหวัด ${province}` },
      { type: 'text', text: reply }
    ])
  }
}
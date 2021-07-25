const bed = require('../data/bed.json')
const line = require('../utils/line')

const requestMap = new Map()

exports.hasRequested = (userId) => requestMap.has(userId)

exports.removeRequest = (userId) => requestMap.delete(userId)

const find = (province) => bed[province]

exports.request = (userId, replyToken) => {
  if (!this.hasRequested(userId)) {
    requestMap.set(userId, new Date())
    return line.client.replyMessage(replyToken, { type: 'text', text: 'กรุณากรอกจังหวัดที่คุณอยู่' })
  }
}

exports.handler = (userId, province) => {
  if (this.hasRequested(userId)) {
    const data = find(province).join('\n\n')
    const reply = '> คุณสามารถติดต่อได้ที่ <\n\n'.concat(data)

    console.log('handle')

    this.removeRequest(userId)
    return line.client.pushMessage(userId, [
      { type: 'text', text: `จังหวัด ${province}` },
      { type: 'text', text: reply }
    ])
  }
}
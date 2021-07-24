const bed = require('../data/bed.json')
const line = require('../utils/line')

const requestMap = new Map()

const hasRequested = (userId) => requestMap.has(userId)
const find = (province) => bed[province]

exports.request = (userId, replyToken) => {
  if (!hasRequested(userId)) {
    requestMap.set(userId, new Date())
    return line.client.replyMessage(replyToken, { type: 'text', text: 'กรุณากรอกจังหวัดที่คุณอยู่' })
  }
}

exports.handler = (userId, province) => {
  if (hasRequested(userId)) {
    const data = find(province).join('\n\n')
    const reply = '> คุณสามารถติดต่อได้ที่ <\n\n'.concat(data)

    requestMap.delete(userId)
    return line.client.pushMessage(userId, [
      { type: 'text', text: `จังหวัด ${province}` },
      { type: 'text', text: reply }
    ])
  }
}
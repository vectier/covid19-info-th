const cases = require('../utils/cases')
const line = require('../utils/line')

const thisCommand = 'สถิติ'

const numberWithCommas = (number) => {
  return parseInt(number).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

exports.handle = async (userId, message, replyToken) => {
  if (message != thisCommand) return

  const theCase = await cases.getLatestCase()

  const [year, month, day] = theCase.date.split('-')
  const date = new Date(year, month, day)
  const thaiFormattedDate = date.toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  const response = [
    `ข้อมูลสถิติโควิด-19\nประจำวันที่ ${thaiFormattedDate}`,
    `ตรวจใหม่: ${numberWithCommas(theCase.tested)} คน`,
    `ติดใหม่: ${numberWithCommas(theCase.cases)} คน`,
    `เสียชีวิตเพิ่ม: ${numberWithCommas(theCase.deaths)} คน`,
    `🏥 ยังรักษาอยู่: ${numberWithCommas(theCase.hospitalized)} คน\n🏠 หายป่วยกลับบ้าน: ${numberWithCommas(theCase.recovered)} คน`,
  ].join('\n\n')

  return line.client.replyMessage(replyToken, { type: 'text', text: response })
}
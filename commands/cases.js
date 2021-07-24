const cases = require('../data/cases')
const line = require('../utils/line')

exports.request = async (replyToken) => {
  const theCase = await cases.getLatestCase()
  
  return line.client.replyMessage(replyToken, { type: 'text', text: ` ข้อมูลสถิติโควิด-19\nประจำวันที่ ${theCase.date}\nตรวจใหม่: ${theCase.tested} คน\nติดใหม่: ${theCase.cases} คน\nยังรักษาอยู่ในโรงพยาบาลทั้งหมด: ${theCase.hospitalized} คน\nเสียชีวิตเพิ่ม: ${theCase.deaths} คน\nหายป่วยกลับบ้าน: ${theCase.recovered} คน` })
}
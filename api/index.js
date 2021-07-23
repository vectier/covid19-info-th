const mode = process.env.NODE_ENV

const [line, lineMiddleware] = require('../utils/line')
const provinces = require('../utils/provinces')

const https = require('https')
const fs = require('fs')
const app = require('express')()
const port = process.env.PORT || 3000

const Bed = require('../commands/bed')

app.post('/api/webhook', lineMiddleware, (req, res) => {
  Promise
    .all(req.body.events.map(handleEvent))
    .then(result => res.json(result))
    .catch(error => {
      console.log(error)
      res.status(500).end()
    })
})

const handleEvent = (event) => {
  if (event.type !== 'message' || event.message.type !== 'text') {
    return Promise.resolve(null)
  }

  const replyToken = event.replyToken
  const message = event.message.text
  const userId = event.source.userId

  if (message == 'หาเตียง') {
    !Bed.hasRequested(userId) && Bed.request(userId, replyToken)
    return line.replyMessage(replyToken, { type: 'text', text: 'กรุณากรอกจังหวัดที่คุณอยู่' })
  }

  if (Bed.hasRequested(userId)) {
    const province = provinces.find(message)
    
    if (!Bed.hasData(province)) {
      return line.replyMessage(replyToken, [
        { type: 'text', text: `ไม่พบข้อมูลของจังหวัด ${province}` },
        { type: 'text', text: `สามารถเป็นส่วนหนึ่งในการพัฒนาได้ที่ https://github.com/Vectier/covid19-info-th` }
      ])
    }

    const result = Bed.find(userId, province)
    const replyMessage = 'คุณสามารถติดต่อได้ที่\n'.concat(result.join('\n'))
    
    return line.pushMessage(userId, [
      { type: 'text', text: `จังหวัด ${province}` },
      { type: 'text', text: replyMessage }
    ])
  }
}

app.all('*', (req, res) => {
  res.json({
    name: 'covid19-th-info',
    repo: 'https://github.com/Vectier/covid19-info-th'
  })
})

if (mode === 'production') {
  app.listen(port, () => console.log(`[PROD] this app listening on port ${port}`))
} else {
  https.createServer({
    key: fs.readFileSync('key.pem'),
    cert: fs.readFileSync('cert.pem')
  }, app).listen(port, () => {
    console.log(`[DEV] this app listening on port ${port}`)
  })
}

module.exports = app
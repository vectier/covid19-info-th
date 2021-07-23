const https   = require('https')
const fs      = require('fs')
const app     = require('express')()

const [line, lineMiddleware] = require('./line')

const Bed     = require('./commands/bed')

app.post('/webhook', lineMiddleware, (req, res) => {
  Promise
    .all(req.body.events.map(handleEvent))
    .then(result => res.json(result))
    .catch(error => {
      console.log(error)
      res.status(500).end()
    })
})

const reply = (replyToken, message) => line.replyMessage(replyToken, { type: 'text', text: message })

const handleEvent = (event) => {
  if (event.type !== 'message' || event.message.type !== 'text') {
    return Promise.resolve(null)
  }

  const replyToken = event.replyToken
  const message = event.message.text
  const userId = event.source.userId

  if (message == 'หาเตียง') {
    !Bed.hasRequested(userId) && Bed.request(userId, replyToken)
    return reply(replyToken, 'กรุณากรอกจังหวัดที่คุณอยู่')
  }
  
  if (Bed.hasRequested(userId)) {
    const result = Bed.find(userId, message)

    const replyMessage = 'คุณสามารถติดต่อได้ที่\n'.concat(result.join('\n'))

    return line.pushMessage(userId, [
      { type: 'text', text: `จังหวัด ${message}` },
      { type: 'text', text: replyMessage }
    ])
  }
}

// https.createServer({
//   key: fs.readFileSync('key.pem'),
//   cert: fs.readFileSync('cert.pem')
// }, app).listen(process.env.PORT || 3000)

app.listen(process.env.PORT || 3000)
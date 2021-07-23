require('dotenv').config()
const https = require('https')
const fs = require('fs')
const app = require('express')()
const [line, lineMiddleware] = require('./line')

app.post('/webhook', lineMiddleware, (req, res) => {
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

  const message = event.message.text

  // TODO: command

  return line.replyMessage(event.replyToken, {
    type: 'text',
    text: message
  })
}

// https.createServer({
//   key: fs.readFileSync('key.pem'),
//   cert: fs.readFileSync('cert.pem')
// }, app).listen(process.env.PORT || 3000)

app.listen(process.env.PORT || 3000)
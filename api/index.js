const mode      = process.env.NODE_ENV
const port      = process.env.PORT || 3000

const https     = require('https')
const fs        = require('fs')
const app       = require('express')()

const line      = require('../utils/line')
const provinces = require('../utils/provinces')

const Bed       = require('../commands/bed')

app.post('/api/webhook', line.middleware, (req, res) => {
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

  // Open command ticket
  if (message == 'หาเตียง') return Bed.request(userId, replyToken)

  const province = provinces.find(message)

  // Command execution
  Bed.handler(userId, province)
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
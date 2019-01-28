const serverless = require('serverless-http')
const express = require('express')
const app = express()

app.post('/register.json', function (req, res) {
  const originUrl = req.query.url
  res.send(originUrl)
})

app.get('/:hashCode', function (req, res) {
  const hashCode = req.params.hashCode
  res.send(hashCode)
})

app.get('/:hashCode/stats', function (req, res) {
  const hashCode = req.params.hashCode
  res.send(`${hashCode} stats`)
})

module.exports.handler = serverless(app)

app.listen(3000, function () {
  console.log('API TEST on port 3000')
})

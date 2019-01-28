const serverless = require('serverless-http')
const express = require('express')
const app = express()

app.get('/', function (req, res) {
    res.send('OK')
})

module.exports.handler = serverless(app)
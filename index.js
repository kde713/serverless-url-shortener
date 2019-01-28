const url = require('url')

const serverless = require('serverless-http')
const express = require('express')
const AWS = require('aws-sdk')

const app = express()

import { getHash } from './utils'

const TABLE_NAME = 'url-shortener'
const dynamoDb = new AWS.DynamoDB.DocumentClient()

app.post('/register.json', function (req, res) {
  const originUrl = req.query.url
  const hashedUrl = getHash(originUrl)

  dynamoDb.get({
    TableName: TABLE_NAME,
    Key: {
      hashCode: hashedUrl
    }
  }, (error, result) => {
    if (result.Item) {
      res.json({
        url: url.format({
          protocol: req.protocol,
          host: req.get('host'),
          pathname: `/${hashedUrl}`
        })
      })
    } else {
      dynamoDb.put({
        TableName: TABLE_NAME,
        Item: {
          hashCode: hashedUrl,
          originUrl: originUrl,
          viewCount: 0
        }
      }, (error, result) => {
        res.status(201).json({
          url: url.format({
            protocol: req.protocol,
            host: req.get('host'),
            pathname: `/${hashedUrl}`
          })
        })
      })
    }
  })
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

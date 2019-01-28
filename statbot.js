const AWS = require('aws-sdk')

const TABLE_NAME = 'url-shortener-stats'
const dynamoDb = new AWS.DynamoDB.DocumentClient()

function getTimeKey(timestamp) {
  let date = new Date(Number(timestamp) * 1000)
  return date.toISOString().match(/^(\d{4}-\d{2}-\d{2})T(\d{2})/g)[0]
}

module.exports.handler = (event, context, callback) => {
  let updateQuery = {}

  event.Records.forEach((record) => {
    if (event.eventName === 'MODIFY') {
      const newImage = record.dynamodb.NewImage
      const timeKey = getTimeKey(newImage.lastVisit.N)
      if (!updateQuery[newImage.hashCode.S]) {
        updateQuery[newImage.hashCode.S] = {
          timeKey: 1
        }
      } else {
        if (!updateQuery[newImage.hashCode.S][timeKey]) updateQuery[newImage.hashCode.S][timeKey] = 1
        else updateQuery[newImage.hashCode.S][timeKey] += 1
      }
    }
  })

  Object.keys(updateQuery).forEach((hashCode) => {
    Object.keys(hashCode).forEach((timeKey) => {
      // TODO
    })
  })
}
import { DocumentClient } from 'aws-sdk/clients/dynamodb'

const options = {
  region: 'localhost',
  endpoint: `http://localhost:${process.env.DYNAMO_DB_PORT}`,
  accesKey: 'x',
  secretAccessKey: 'x',
}

const isOffline = () => {
  return process.env.IS_OFFLINE
}

const dynamoDBClient = isOffline()
  ? new DocumentClient(options)
  : new DocumentClient()

export default dynamoDBClient

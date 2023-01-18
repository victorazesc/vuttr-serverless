import { APIGatewayProxyEvent } from 'aws-lambda'

export default interface IRequestProxyEvent
  extends Partial<APIGatewayProxyEvent> {
  body: any
}

import { injectLambdaContext, Logger } from '@aws-lambda-powertools/logger'
import middy from '@middy/core'
import httpErrorHandlerMiddleware from '@middy/http-error-handler'
import middyJsonBodyParser from '@middy/http-json-body-parser'
import { apiGatewayResponseMiddleware } from './middleware'
const logger = new Logger()

export const middyfy = (handler) => {
  return middy(handler)
    .use(injectLambdaContext(logger))
    .use(middyJsonBodyParser())
    .use(httpErrorHandlerMiddleware())
    .use(apiGatewayResponseMiddleware())
}

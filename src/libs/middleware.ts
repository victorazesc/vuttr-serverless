import { Logger } from '@aws-lambda-powertools/logger'
import middy from '@middy/core'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { formatJSONResponse } from './apiGateway'

import { ErrorResolve } from '../types/errorResolver.dto'
import MiddlewareFunction = middy.MiddlewareFn

export const apiGatewayResponseMiddleware = () => {
  const after: MiddlewareFunction<APIGatewayProxyEvent, any> = async (
    request,
  ) => {
    if (request.event?.httpMethod === 'DELETE') {
      request.response = { statusCode: 204, body: null, headers: null }
    }

    if (
      !request.event?.httpMethod ||
      request.response === undefined ||
      request.response === null
    ) {
      return
    }

    const existingKeys = Object.keys(request.response)
    const isHttpResponse =
      existingKeys.includes('statusCode') &&
      existingKeys.includes('headers') &&
      existingKeys.includes('body')

    if (isHttpResponse) {
      return
    }

    request.response = formatJSONResponse(request.response)
  }

  const onError: MiddlewareFunction<
    APIGatewayProxyEvent,
    APIGatewayProxyResult
  > = async (request) => {
    const { error } = request
    const logger = new Logger()
    let statusCode = 500

    if (error instanceof ErrorResolve) {
      statusCode = error.statusCode
    }

    logger.error(error.message)

    request.response = formatJSONResponse(
      { message: error.message },
      statusCode,
    )
  }

  return {
    after,
    onError,
  }
}

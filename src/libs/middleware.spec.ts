import { mocked } from 'jest-mock'
import { formatJSONResponse } from './apiGateway'
import { ErrorResolve } from '../types/errorResolver.dto'
import { apiGatewayResponseMiddleware } from './middleware'

jest.mock('./apiGateway')

describe('Middleware', () => {
  const formattedResponse: any = {}

  let mockFormatJSONResponse: jest.MockedFunction<typeof formatJSONResponse>

  beforeEach(() => {
    mockFormatJSONResponse = mocked(formatJSONResponse)
    mockFormatJSONResponse.mockReturnValue(formattedResponse)
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  describe('after', () => {
    it('should format response when request is a NORMAL response', async () => {
      const request = {
        event: { httpMethod: 'POST' },
        response: {
          message: 'success',
        },
      }

      const response = request.response

      await apiGatewayResponseMiddleware().after(request as any)

      expect(mockFormatJSONResponse).toHaveBeenCalledWith(response)
      expect(request.response).toEqual(formattedResponse)
    })

    test.each([
      [{ event: {} }],
      [{ event: { httpMethod: 'POST' }, response: null }],
      [{ event: { httpMethod: 'POST' }, response: undefined }],
    ])(
      'should not format response when request is not http request or response is null, undefined',
      async (request) => {
        await apiGatewayResponseMiddleware().after(request as any)

        expect(mockFormatJSONResponse).not.toHaveBeenCalled()
      },
    )

    it('should not format response when request already is an http response', async () => {
      const request = {
        event: { httpMethod: 'POST' },
        response: {
          statusCode: 200,
          headers: {},
          body: '',
        },
      }

      await apiGatewayResponseMiddleware().after(request as any)

      expect(mockFormatJSONResponse).not.toHaveBeenCalled()
    })

    it('should format response when request already is an http method delete', async () => {
      const request = {
        event: { httpMethod: 'DELETE' },
      }

      await apiGatewayResponseMiddleware().after(request as any)

      expect(mockFormatJSONResponse).not.toHaveBeenCalled()
    })
  })

  describe('onError', () => {
    beforeEach(() => {
      jest.spyOn(console, 'error')
    })

    it('should format with default statusCode when error is not an ErrorResolve', async () => {
      const error = new Error('Unexpected error')
      const request: any = {
        error,
      }

      await apiGatewayResponseMiddleware().onError(request)

      expect(mockFormatJSONResponse).toHaveBeenCalledWith(
        { message: error.message },
        500,
      )
      expect(request.response).toEqual(formattedResponse)
      expect(console.error).not.toHaveBeenCalled()
    })

    it('should format with custom statusCode when error is an ErrorResolve', async () => {
      const error = new ErrorResolve('Unexpected error', 401)
      const request: any = {
        error,
      }

      await apiGatewayResponseMiddleware().onError(request)

      expect(mockFormatJSONResponse).toHaveBeenCalledWith(
        { message: error.message },
        401,
      )
      expect(request.response).toEqual(formattedResponse)
      expect(console.error).not.toHaveBeenCalled()
    })
  })
})

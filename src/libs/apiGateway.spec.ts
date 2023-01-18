import { formatJSONResponse } from './apiGateway'

describe('apiGateway', () => {
  describe('formatJSONResponse', () => {
    it('should not format response when request already is an http response', async () => {
      const response = {
        message: 'Any message',
      }

      const actual = formatJSONResponse(response)

      expect(actual.body).toBe(JSON.stringify(response))
    })
  })
})

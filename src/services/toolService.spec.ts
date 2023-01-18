import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import ToolsService from './toolService'

jest.mock('uuid', () => ({ v4: () => '1' }))

describe('ToolsService', () => {
  let toolsService: ToolsService
  let dynamoClient
  beforeEach(async () => {
    dynamoClient = Object.getPrototypeOf(new DocumentClient())
    toolsService = new ToolsService(dynamoClient)
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  describe('test method createTool', () => {
    it('should successfully create a tool', async () => {
      const mockCreateTool = {
        title: 'hotel',
        link: 'https://github.com/typicode/hotel',
        description:
          'Local app manager. Start apps within your browser, developer tool with local .localhost domain and https out of the box.',
        tags: [
          'node',
          'organizing',
          'webapps',
          'domain',
          'developer',
          'https',
          'proxy',
        ],
      }

      jest.spyOn(dynamoClient, 'put').mockReturnValue({
        promise: async () =>
          await Promise.resolve({ ...mockCreateTool, id: '1' }),
      })

      const response = await toolsService.createTool(mockCreateTool)
      expect(response).toStrictEqual({ ...mockCreateTool, id: '1' })
    })
    it('should not create a tool and should return an error', async () => {
      try {
        const mockCreateTool = {
          title: '',
          link: 'https://github.com/typicode/hotel',
          description:
            'Local app manager. Start apps within your browser, developer tool with local .localhost domain and https out of the box.',
          tags: [],
        }

        jest.spyOn(dynamoClient, 'put').mockReturnValue({
          promise: async () =>
            await Promise.resolve({ ...mockCreateTool, id: '1' }),
        })

        await toolsService.createTool(mockCreateTool)
      } catch (error) {
        expect(error.message).toMatch('isNotEmpty')
      }
    })
  })

  describe('test method getAllTools', () => {
    it('should successfully bring all the tools', async () => {
      const mockReturnTools = {
        Items: [
          {
            id: '1',
            title: 'Notion',
            link: 'https://notion.so',
            description:
              'All in one tool to organize teams and ideas. Write, plan, collaborate, and get organized. ',
            tags: [
              'organization',
              'planning',
              'collaboration',
              'writing',
              'calendar',
            ],
          },
          {
            id: '2',
            title: 'json-server',
            link: 'https://github.com/typicode/json-server',
            description:
              'Fake REST API based on a json schema. Useful for mocking and creating APIs for front-end devs to consume in coding challenges.',
            tags: ['api', 'json', 'schema', 'node', 'github', 'rest'],
          },
          {
            id: '3',
            title: 'fastify',
            link: 'https://www.fastify.io/',
            description:
              'Extremely fast and simple, low-overhead web framework for NodeJS. Supports HTTP2.',
            tags: ['web', 'framework', 'node', 'http2', 'https', 'localhost'],
          },
        ],
      }

      jest.spyOn(dynamoClient, 'scan').mockReturnValue({
        promise: async () => await Promise.resolve(mockReturnTools),
      })

      const response = await toolsService.getAllTools()
      expect(response).toHaveLength(3)
    })

    it('should successfully bring the tools according to the searched tag', async () => {
      const mockReturnTools = {
        Items: [
          {
            id: '2',
            title: 'json-server',
            link: 'https://github.com/typicode/json-server',
            description:
              'Fake REST API based on a json schema. Useful for mocking and creating APIs for front-end devs to consume in coding challenges.',
            tags: ['api', 'json', 'schema', 'node', 'github', 'rest'],
          },
          {
            id: '3',
            title: 'fastify',
            link: 'https://www.fastify.io/',
            description:
              'Extremely fast and simple, low-overhead web framework for NodeJS. Supports HTTP2.',
            tags: ['web', 'framework', 'node', 'http2', 'https', 'localhost'],
          },
        ],
      }

      jest.spyOn(dynamoClient, 'scan').mockReturnValue({
        promise: async () => await Promise.resolve(mockReturnTools),
      })

      const response = await toolsService.getAllTools('node')
      expect(response).toHaveLength(2)
    })
  })

  describe('test method getTool', () => {
    it('should successfully bring a tool according to the id', async () => {
      const mockReturnTool = {
        Item: [
          {
            id: '1',
            title: 'Notion',
            link: 'https://notion.so',
            description:
              'All in one tool to organize teams and ideas. Write, plan, collaborate, and get organized. ',
            tags: [
              'organization',
              'planning',
              'collaboration',
              'writing',
              'calendar',
            ],
          },
        ],
      }

      jest.spyOn(dynamoClient, 'get').mockReturnValue({
        promise: async () => await Promise.resolve(mockReturnTool),
      })

      const response = await toolsService.getTool('')

      expect(response).toHaveLength(1)
      expect(response[0].id).toBe('1')
    })

    it('should return an error if it does not find the tool', async () => {
      try {
        jest.resetAllMocks()
        jest.spyOn(toolsService as any, 'getToolById').mockReturnValue(null)

        await toolsService.getTool('0')
      } catch (error) {
        expect(error.message).toBe('Tool does not exist')
      }
    })
  })

  describe('test method deleteTool', () => {
    it('should be possible to delete a tool', async () => {
      jest.spyOn(dynamoClient, 'delete').mockReturnValue({
        promise: async () => {
          await Promise.resolve()
        },
      })

      const response = await toolsService.deleteTool('1')

      expect(response).toBe(true)
    })
  })

  describe('test method updateTool', () => {
    it('should be possible to update a tool', async () => {
      const mockUpdateTool = {
        Attributes: {
          title: 'hotelaria',
        },
      }
      const mockTool = {
        title: 'hotel',
        link: 'https://github.com/typicode/hotel',
        description:
          'Local app manager. Start apps within your browser, developer tool with local .localhost domain and https out of the box.',
        tags: [
          'node',
          'organizing',
          'webapps',
          'domain',
          'developer',
          'https',
          'proxy',
        ],
      }

      jest.spyOn(toolsService as any, 'getToolById').mockReturnValue(mockTool)
      jest.spyOn(dynamoClient, 'update').mockReturnValue({
        promise: async () => await Promise.resolve(mockUpdateTool),
      })

      const response = await toolsService.updateTool('1', mockTool)

      expect(response).toStrictEqual(mockUpdateTool.Attributes)
    })

    it('should return an error with an empty request body', async () => {
      try {
        await toolsService.updateTool('1', null as any)
      } catch (error) {
        expect(error.message).toStrictEqual('Empty Request')
      }
    })

    it('should return an error the tool does not exist', async () => {
      try {
        jest.resetAllMocks()
        jest.spyOn(toolsService as any, 'getToolById').mockReturnValue(null)

        await toolsService.updateTool('1', {})
      } catch (error) {
        expect(error.message).toBe('Tool does not exist')
      }
    })
  })
})

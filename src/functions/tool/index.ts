import { handlerPath } from '@libs/handlerResolver'

const authorizer = {
  name: 'PrivateAuthorizer',
  type: 'COGNITO_USER_POOLS',
  arn: { 'Fn::GetAtt': ['UserPool', 'Arn'] },
  claims: ['email'],
}

export const getAllTools = {
  handler: `${handlerPath(__dirname)}/handler.getAllTools`,
  events: [
    {
      http: {
        method: 'get',
        path: 'tools/',
        swaggerTags: ['Tools'],
        responseData: {
          200: {
            description: 'this went well, return a list off tools',
          },
        },
        authorizer,
      },
    },
  ],
}

export const createTool = {
  handler: `${handlerPath(__dirname)}/handler.createTool`,
  events: [
    {
      http: {
        method: 'post',
        path: 'tools',
        bodyType: 'CreateToolDTO',
        swaggerTags: ['Tools'],
        responseData: {
          200: {
            description: 'this went well',
            bodyType: 'ToolDTO',
          },
        },
        authorizer,
      },
    },
  ],
}

export const getTool = {
  handler: `${handlerPath(__dirname)}/handler.getTool`,
  events: [
    {
      http: {
        method: 'get',
        path: 'tools/{id}',
        swaggerTags: ['Tools'],
        responseData: {
          200: {
            description: 'this went well',
            bodyType: 'ToolDTO',
          },
        },
        authorizer,
      },
    },
  ],
}

export const updateTool = {
  handler: `${handlerPath(__dirname)}/handler.updateTool`,
  events: [
    {
      http: {
        method: 'put',
        path: 'tools/{id}',
        swaggerTags: ['Tools'],
        authorizer,
      },
    },
  ],
}

export const deleteTool = {
  handler: `${handlerPath(__dirname)}/handler.deleteTool`,
  events: [
    {
      http: {
        method: 'delete',
        path: 'tools/{id}',
        swaggerTags: ['Tools'],
        responseData: {
          204: {
            description: 'this went well, no response body',
          },
        },
        authorizer,
      },
    },
  ],
}

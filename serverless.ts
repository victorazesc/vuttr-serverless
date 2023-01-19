import type { AWS } from '@serverless/typescript'

import {
  authLogin,
  authSignup,
  changePassword,
  forgotPassword,
} from '@functions/auth'
import {
  createTool,
  deleteTool,
  getAllTools,
  getTool,
  updateTool,
} from '@functions/tool'

const serverlessConfiguration: AWS = {
  service: 'vuttr',
  frameworkVersion: '3',
  plugins: [
    'serverless-dotenv-plugin',
    'serverless-auto-swagger',
    'serverless-esbuild',
    'serverless-dynamodb-local',
    'serverless-offline',
  ],
  useDotenv: true,
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
      USER_POOL_ID: '${env:USER_POOL_ID}',
      CLIENT_ID: '${env:CLIENT_ID}',
    },
    lambdaHashingVersion: '20201221',
    iamRoleStatements: [
      {
        Effect: 'Allow',
        Action: ['dynamodb:*'],
        Resource: ['*'],
      },
      {
        Effect: 'Allow',
        Action: ['s3:*'],
        Resource: ['*'],
      },
      {
        Effect: 'Allow',
        Action: ['cognito-idp:*'],
        Resource: ['*'],
      },
    ],
  },
  functions: {
    createTool,
    deleteTool,
    getAllTools,
    getTool,
    updateTool,
    authLogin,
    authSignup,
    changePassword,
    forgotPassword,
  },
  package: { individually: false, include: ['./src/templates/**'] },
  custom: {
    autoswagger: {
      typefiles: ['./src/types/tool.dto.ts', './src/types/auth.dto.ts'],
      apiType: 'http',
      swaggerPath: 'docs',
      basePath: '/dev',
    },

    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk', 'chrome-aws-lambda'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
      external: ['chrome-aws-lambda'],
    },
    dynamodb: {
      stages: ['dev', 'local'],
      start: {
        port: '${env:DYNAMO_DB_PORT}',
        inMemory: true,
        migrate: true,
      },
    },
  },
  resources: {
    Resources: {
      toolsTable: {
        Type: 'AWS::DynamoDB::Table',
        Properties: {
          TableName: 'toolsTable',
          ProvisionedThroughput: {
            ReadCapacityUnits: 5,
            WriteCapacityUnits: 5,
          },
          AttributeDefinitions: [
            {
              AttributeName: 'id',
              AttributeType: 'S',
            },
          ],
          KeySchema: [
            {
              AttributeName: 'id',
              KeyType: 'HASH',
            },
          ],
        },
      },
      UserPool: {
        Type: 'AWS::Cognito::UserPool',
        Properties: {
          UserPoolName: 'cognito_test',
          Schema: [
            {
              Name: 'email',
              Required: true,
              Mutable: true,
            },
          ],
          Policies: {
            PasswordPolicy: {
              MinimumLength: 6,
            },
          },
          AutoVerifiedAttributes: ['email'],
        },
      },
      UserClient: {
        Type: 'AWS::Cognito::UserPoolClient',
        Properties: {
          ClientName: 'user-pool-ui',
          GenerateSecret: false,
          UserPoolId: '${env:USER_POOL_ID}',
          AccessTokenValidity: 5,
          IdTokenValidity: 5,
          ExplicitAuthFlows: ['ADMIN_NO_SRP_AUTH'],
        },
      },
    },
  },
}

module.exports = serverlessConfiguration

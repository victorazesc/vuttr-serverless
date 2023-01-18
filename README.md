# Overview

VUTTR application (Very Useful Tools to Remember). The application is a simple repository for managing tools with their respective names, links, descriptions and tags.

![image](https://user-images.githubusercontent.com/95045208/213241955-dddabcf8-fe6b-4993-9cca-323575b9545f.png)

Application built using the following stack:

- AWS Cognito,
- AWS Api Gateway,
- AWS DynamoDB
- AWS Lambda

Written in TypeScript using Serverless Framework with the Middy lib.

## Instruções de instalação/implantação

set the environment variables:

```
USER_POOL_ID=COGNITO_USER_POOL_ID
CLIENT_ID=COGNITO_CLIENT_ID
DYNAMO_DB_PORT=LOCAL_DYNAMO_DB_PORT
```

Depending on your preferred package manager, follow the instructions below to deploy your project.

> **Requirements**: NodeJS `lts/fermium (v.14.15.0)`. If you are using [nvm](https://github.com/nvm-sh/nvm), run `nvm use` to ensure you are using the same version of Node at the location and runtime of your lambda.

### Using NPM

- Run `npm i` to install the project dependencies
- Run `npm run dev` to offline development
- Run `npm run deploy` to deploy this stack to AWS

### Using Yarn

- Run `yarn` to install the project dependencies
- Run `yarn dev` to offline development
- Run `yarn sls deploy` to deploy this stack to AWS

## The available routes are:

- Public Routes
  - `POST /signup`to register a new user
  - `POST /login` to generate an authentication token
- Private Routes

  > :warning: :warning: To access protected routes, a valid token must be sent in the header with authorization but not necessary in local environment

  - `POST /tools` to register a new tool
  - `GET /tools` to list all registered tools
  - `GET /tools?tag=ANY_TAG` to list all tools registered with this tag
  - `GET /tool/:id` to look for a tool
  - `DELETE /tool/:id` to delete a tool
  - `PUT /tool/:id`to update a tool

## Test your service

The unit test of the service can be performed `run yarn test` or `npm run test`.

To create a tool, the following content must be sent in the request body:

```
{
    "title": "SOME TITLE",
    "link": "SOME LINK",
    "description": "SOME DESCRIPTION",
    "tags":["SOME TAG"]
}
```

### Locally

Localmente, execute o seguinte comando:

- `yarn offline `

Verifique a docuemntação do swagger na rota `GET /docs` para obter mais informações.

### Remotely

Copy and replace your `url` - found in Serverless `deploy` command output - and `name` parameter in the following `curl` command in your terminal or in Postman to test your newly deployed application.

```
curl --location --request POST 'https://myApiEndpoint/dev/myfunction' \
--header 'Content-Type: application/json' \
--data-raw '{
    "title": "SOME TITLE",
    "link": "SOME LINK",
    "description": "SOME DESCRIPTION",
    "tags":["SOME TAG"]
}'
```

### Project structure

The project code base is mainly located within the `src` folder. This folder is divided in:

- `functions` - containing code base and configuration for your lambda functions
- `libs` - containing shared code base between your lambdas
- `model` - containing database settings
- `services` - containing the services responsible for the business rules
- `types`- containing the shared types and DTOs

```
.
├── src
│   ├── functions                 # Lambda configuration and source code folder
│   │   ├── auth
│   │   │   ├── handler.ts        # `Auth` lambda source code
│   │   │   ├── index.ts          # `Auth` lambda Serverless configuration
│   │   └── tool
│   │       ├── handler.ts        # `Tool` lambda source code
│   │       ├── index.ts          # `Tool` Lambda Serverless configuration
│   │
│   ├── libs                      # Lambda shared code
│   |   └── apiGateway.spec.ts    # API Gateway tests
│   |   └── apiGateway.ts         # API Gateway specific helpers
│   |   └── handlerResolver.ts    # Sharable library for resolving lambda handlers
│   |   └── lambda.ts             # Lambda middleware
│   |   └── middleware.spec.ts    # middleware tests
│   |   └── middleware.ts         # API Gateway response middleware
│   |   └── validateResolver.ts   # DTOs validator
|   |
│   ├── model                     # Database settings
│   |    └── index.ts             # Configure database instance
|   |
|   ├── services
│   |    └── authService.spec.ts  # Auth service test
|   |    └── authService          # Auth business rule
│   |    └── toolsService.spec.ts # Tool service test
|   |    └── toolsService         # Tool business rule
|   |    └── index.ts             # Instace services
|   │
|   └── types
│        └── auth.dto.ts          # Auth data transfer objects
|        └── errorResolver.dto.ts # Error resolver data transfer object
│        └── request.d.ts         # Request interface
|        └── tool.dto.ts          # Tool data transfer objects
│
├── jest.config.js                # Jest configuration file
├── package.json
├── serverless.ts                 # Serverless service file
├── tsconfig.json                 # Typescript compiler configuration
└── tsconfig.paths.json           # Typescript paths

```

### 3rd party libraries

- [@aws-lambda-powertools/logger](https://github.com/awslabs/aws-lambda-powertools-typescript)
- [json-schema-to-ts](https://github.com/ThomasAribart/json-schema-to-ts) - Default logs observability
- [class-transformer](https://github.com/typestack/class-transformer) - Decorators on validation class
- [class-validation](https://github.com/typestack/class-validator) - Decorator and non-dacorator validation according to class
- [serverless-auto-swagger](https://github.com/completecoding/serverless-auto-swagger) - Generate Swagger docs base on DTO and Types
- [serverless-dotenv-plugin](https://github.com/neverendingqs/serverless-dotenv-plugin) - Use local
- [middy](https://github.com/middyjs/middy) - middleware engine for Node.Js lambda.
- [jest](https://jestjs.io/pt-BR/) - Application test coverage
- [http-json-body-parser](https://github.com/middyjs/middy/tree/master/packages/http-json-body-parser) to convert API Gateway `event.body` property, originally passed as a stringified JSON, to its corresponding parsed object
- [@serverless/typescript](https://github.com/serverless/typescript) - provides up-to-date TypeScript definitions for your `serverless.ts` service file

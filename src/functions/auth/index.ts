import { handlerPath } from '@libs/handlerResolver'

export const authLogin = {
  handler: `${handlerPath(__dirname)}/handler.login`,
  events: [
    {
      http: {
        method: 'post',
        path: 'auth/login',
        cors: true,
        swaggerTags: ['Auth'],
        bodyType: 'AuthDTO',
        responseData: {
          200: {
            description: 'login Success',
            bodyType: 'LoginResponseDTO',
          },
        },
      },
    },
  ],
}

export const authSignup = {
  handler: `${handlerPath(__dirname)}/handler.signup`,
  events: [
    {
      http: {
        method: 'post',
        path: 'auth/signup',
        cors: true,
        swaggerTags: ['Auth'],
        bodyType: 'AuthDTO',
        responseData: {
          200: {
            description: 'register Success',
          },
        },
      },
    },
  ],
}

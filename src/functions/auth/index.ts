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

export const forgotPassword = {
  handler: `${handlerPath(__dirname)}/handler.forgotPassword`,
  events: [
    {
      http: {
        method: 'post',
        path: 'auth/forgot-password',
        cors: true,
        swaggerTags: ['Auth'],
        bodyType: 'ForgotPasswordDTO',
        responseData: {
          204: {
            description: 'this went well, no response body',
          },
        },
      },
    },
  ],
}

export const changePassword = {
  handler: `${handlerPath(__dirname)}/handler.changePassword`,
  events: [
    {
      http: {
        method: 'post',
        path: 'auth/change-password',
        cors: true,
        swaggerTags: ['Auth'],
        bodyType: 'CofirmPasswordDTO',
        responseData: {
          204: {
            description: 'this went well, no response body',
          },
        },
      },
    },
  ],
}

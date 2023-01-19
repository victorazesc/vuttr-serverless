import { handlerValidate } from '@libs/validateResolver'
import { CognitoIdentityServiceProvider } from 'aws-sdk'
import {
  AuthDTO,
  CofirmPasswordDTO,
  ForgotPasswordDTO,
  LoginResponseDTO,
} from '../../src/types/auth.dto'

export default class AuthService {
  constructor(private readonly cognito: CognitoIdentityServiceProvider) {}

  async login(data: AuthDTO): Promise<LoginResponseDTO> {
    const authDTO = new AuthDTO(data)
    await handlerValidate(authDTO)
    const params = {
      AuthFlow: 'ADMIN_NO_SRP_AUTH',
      UserPoolId: process.env.USER_POOL_ID,
      ClientId: process.env.CLIENT_ID,
      AuthParameters: {
        USERNAME: authDTO.email,
        PASSWORD: authDTO.password,
      },
    }
    const response = await this.cognito.adminInitiateAuth(params).promise()
    return {
      message: 'Success',
      token: response.AuthenticationResult.IdToken,
    }
  }

  async signup(data: AuthDTO): Promise<boolean> {
    const authDTO = new AuthDTO(data)
    await handlerValidate(authDTO)
    const params = {
      UserPoolId: process.env.USER_POOL_ID,
      Username: authDTO.email,
      UserAttributes: [
        {
          Name: 'email',
          Value: authDTO.email,
        },
        {
          Name: 'email_verified',
          Value: 'true',
        },
      ],
      MessageAction: 'SUPPRESS',
    }
    const response = await this.cognito.adminCreateUser(params).promise()
    if (response.User) {
      const paramsForSetPass = {
        Password: authDTO.password,
        UserPoolId: process.env.USER_POOL_ID,
        Username: authDTO.email,
        Permanent: true,
      }

      await this.cognito.adminSetUserPassword(paramsForSetPass).promise()
      return true
    }
  }

  async forgotPassword(data: ForgotPasswordDTO): Promise<boolean> {
    const forgotPasswordDTO = new ForgotPasswordDTO(data)
    await handlerValidate(forgotPasswordDTO)
    const params = {
      ClientId: process.env.CLIENT_ID,
      Username: forgotPasswordDTO.email,
    }
    await this.cognito.forgotPassword(params).promise()
    return true
  }

  async changePassword(data: CofirmPasswordDTO): Promise<boolean> {
    const cofirmPasswordDTO = new CofirmPasswordDTO(data)
    await handlerValidate(cofirmPasswordDTO)

    await this.cognito
      .confirmForgotPassword({
        ClientId: process.env.CLIENT_ID,
        ConfirmationCode: cofirmPasswordDTO.confirmationCode,
        Password: cofirmPasswordDTO.password,
        Username: cofirmPasswordDTO.email,
      })
      .promise()

    return true
  }
}

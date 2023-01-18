import { handlerValidate } from '@libs/validateResolver'
import { CognitoIdentityServiceProvider } from 'aws-sdk'
import { AuthDTO, LoginResponseDTO } from '../../src/types/auth.dto'

export default class AuthService {
  constructor(private readonly cognito: CognitoIdentityServiceProvider) {}

  async login(email: string, password: string): Promise<LoginResponseDTO> {
    const authDTO = new AuthDTO({ email, password })
    await handlerValidate(authDTO)
    const params = {
      AuthFlow: 'ADMIN_NO_SRP_AUTH',
      UserPoolId: process.env.USER_POOL_ID,
      ClientId: process.env.CLIENT_ID,
      AuthParameters: {
        USERNAME: email,
        PASSWORD: password,
      },
    }
    const response = await this.cognito.adminInitiateAuth(params).promise()
    return {
      message: 'Success',
      token: response.AuthenticationResult.IdToken,
    }
  }

  async signup(email: string, password: string): Promise<boolean> {
    const authDTO = new AuthDTO({ email, password })
    await handlerValidate(authDTO)
    const params = {
      UserPoolId: process.env.USER_POOL_ID,
      Username: email,
      UserAttributes: [
        {
          Name: 'email',
          Value: email,
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
        Password: password,
        UserPoolId: process.env.USER_POOL_ID,
        Username: email,
        Permanent: true,
      }
      await this.cognito.adminSetUserPassword(paramsForSetPass).promise()
      return true
    }
  }
}

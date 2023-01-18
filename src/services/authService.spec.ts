import { CognitoIdentityServiceProvider } from 'aws-sdk'
import AuthService from './authService'

describe('AuthService', () => {
  let authService: AuthService
  let cognotoIdentityServiceProvider

  beforeEach(async () => {
    cognotoIdentityServiceProvider = Object.getPrototypeOf(
      new CognitoIdentityServiceProvider(),
    )
    authService = new AuthService(cognotoIdentityServiceProvider)
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('should be defined', () => {
    expect(authService).toBeDefined()
  })

  describe('test method signup', () => {
    it('should be success', async () => {
      const mockSignupResponse = {
        User: {
          Username: 'email@email.com',
          Attributes: [
            { Name: 'sub', Value: '75e81672-b36c-4134-995d-45615dd4e51a' },
            { Name: 'email_verified', Value: 'true' },
            { Name: 'email', Value: 'email@email.com' },
          ],
          UserCreateDate: '2023-01-16T16:40:24.674Z',
          UserLastModifiedDate: '2023-01-16T16:40:24.674Z',
          Enabled: true,
          UserStatus: 'FORCE_CHANGE_PASSWORD',
        },
      }

      jest
        .spyOn(cognotoIdentityServiceProvider, 'adminCreateUser')
        .mockReturnValue({
          promise: async () => await Promise.resolve(mockSignupResponse),
        })
      jest
        .spyOn(cognotoIdentityServiceProvider, 'adminSetUserPassword')
        .mockReturnValue({
          promise: async () => {
            await Promise.resolve()
          },
        })

      const response = await authService.signup('email@email.com', '123pass')
      expect(response).toBe(true)
    })
  })

  describe('test method login', () => {
    it('should be success', async () => {
      const mockLoginResponse = {
        AuthenticationResult: {
          IdToken: '123',
        },
      }

      jest
        .spyOn(cognotoIdentityServiceProvider, 'adminInitiateAuth')
        .mockReturnValue({
          promise: async () => await Promise.resolve(mockLoginResponse),
        })

      const response = await authService.login('email@email.com', '123pass')
      expect(response.token).toBe('123')
    })
  })
})

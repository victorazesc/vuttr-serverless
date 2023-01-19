import { middyfy } from '@libs/lambda'
import { authService } from 'src/services'
import IRequestProxyEvent from 'src/types/request'

export const login = middyfy(async (event: IRequestProxyEvent) => {
  const loginResponse = await authService.login(event.body)
  return loginResponse
})

export const signup = middyfy(async (event: IRequestProxyEvent) => {
  await authService.signup(event.body)
  return { message: 'User register successfuly!' }
})

export const forgotPassword = middyfy(async (event: IRequestProxyEvent) => {
  await authService.forgotPassword(event.body)
  return { message: 'Verification code sent!' }
})

export const changePassword = middyfy(async (event: IRequestProxyEvent) => {
  await authService.changePassword(event.body)
  return { message: 'Password changed successfully!' }
})

import { middyfy } from '@libs/lambda'
import { authService } from 'src/services'
import IRequestProxyEvent from 'src/types/request'

export const login = middyfy(async (event: IRequestProxyEvent) => {
  const { email, password } = event.body
  const loginResponse = await authService.login(email, password)
  return loginResponse
})

export const signup = middyfy(async (event: IRequestProxyEvent) => {
  const { email, password } = event.body
  await authService.signup(email, password)
  return { message: 'User register successfuly!' }
})

import { IsEmail, IsNotEmpty } from 'class-validator'

export class LoginResponseDTO {
  message: string
  token: string
}

export class AuthDTO {
  @IsNotEmpty()
  @IsEmail()
  email: string

  @IsNotEmpty()
  password: string

  constructor(auth: AuthDTO) {
    this.email = auth.email
    this.password = auth.password
  }
}

export class ForgotPasswordDTO {
  @IsNotEmpty()
  @IsEmail()
  email: string

  constructor(auth: ForgotPasswordDTO) {
    this.email = auth.email
  }
}
export class CofirmPasswordDTO {
  @IsNotEmpty()
  @IsEmail()
  email: string

  @IsNotEmpty()
  password: string
  @IsNotEmpty()
  confirmationCode: string

  constructor(auth: CofirmPasswordDTO) {
    this.email = auth.email
    this.password = auth.password
    this.confirmationCode = auth.confirmationCode
  }
}

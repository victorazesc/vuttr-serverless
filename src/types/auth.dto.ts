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

import { IsEmail, IsNotEmpty, IsString, MaxLength } from "class-validator"

export class LoginDTO {
  @IsEmail()
  @IsNotEmpty()
  readonly email: string

  @IsString()
  @MaxLength(20)
  @IsNotEmpty()
  readonly password: string
}
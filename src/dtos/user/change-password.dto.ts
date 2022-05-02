import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator"

export class ChangePasswordDTO {
  @MinLength(6)
  @MaxLength(20)
  @IsString()
  @IsNotEmpty()
  readonly password: string

  @MinLength(6)
  @MaxLength(20)
  @IsString()
  @IsNotEmpty()
  readonly newPassword: string
}
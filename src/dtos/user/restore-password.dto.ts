import { IsEmail, IsNotEmpty, IsOptional, IsString, Length, MaxLength, MinLength } from "class-validator"

export class RestorePasswordDTO {
  @IsEmail()
  @IsNotEmpty()
  readonly email: string

  @IsOptional()
  @Length(9)
  @IsString()
  readonly restoreCode: string | null = null

  @IsOptional()
  @MinLength(6)
  @MaxLength(20)
  @IsString()
  readonly password: string
}
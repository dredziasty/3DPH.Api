import { IsEmail, IsOptional, IsString, MaxLength, MinLength } from "class-validator"

export class ModifyUserDTO {
  @IsString()
  @MinLength(3)
  @MaxLength(20)
  @IsOptional()
  readonly username?: string

  @IsEmail()
  @IsOptional()
  readonly email: string
}
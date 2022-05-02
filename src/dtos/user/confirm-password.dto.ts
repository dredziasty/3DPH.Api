import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator"

export class ConfirmPasswordDTO {
  @MinLength(6)
  @MaxLength(20)
  @IsString()
  @IsNotEmpty()
  readonly password: string
}
import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator"

export class UploadFileDTO {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(25)
  readonly name: string

  @IsString()
  @IsNotEmpty()
  readonly extension: string
}
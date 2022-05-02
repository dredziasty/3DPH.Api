import { IsHexColor, IsNumber, IsOptional, IsPositive, IsString, MaxLength } from 'class-validator'

export class ModifyFilamentDTO {
  @IsOptional()
  @IsString()
  @MaxLength(25)
  readonly type: string

  @IsOptional()
  @IsString()
  @MaxLength(25)
  readonly brand: string

  @IsOptional()
  @IsNumber()
  @IsPositive()
  readonly diameter: number

  @IsOptional()
  @IsString()
  @MaxLength(25)
  readonly color: string

  @IsOptional()
  @IsHexColor()
  readonly colorHex: string

  @IsString()
  @IsOptional()
  @MaxLength(40)
  readonly name: string

  @IsString()
  @IsOptional()
  @MaxLength(500)
  readonly description: string
}
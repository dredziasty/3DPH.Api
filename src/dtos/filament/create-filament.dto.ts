import { IsHexColor, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, MaxLength }from 'class-validator'

export class CreateFilamentDTO {
  @IsNotEmpty()
  @IsString()
  @MaxLength(25)
  readonly type: string
  
  @IsNotEmpty()
  @IsString()
  @MaxLength(25)
  readonly brand: string

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  readonly diameter: number

  @IsNotEmpty()
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
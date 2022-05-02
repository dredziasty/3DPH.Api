import { IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from "class-validator"

export class ModifyProjectDTO {
  @IsString()
  @IsOptional()
  @MinLength(3)
  @MaxLength(25)
  readonly name?: string

  @IsString()
  @IsOptional()
  @MaxLength(100)
  readonly shortDescription?: string

  @IsString()
  @IsOptional()
  @MaxLength(500)
  readonly description?: string
}
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, IsUrl, Max, MaxLength, Min, MinLength } from "class-validator"
import { IsObjectId, IsGreaterOrEqualThan } from "../../shared/decorators"
import { TObjectId } from "../../shared/types"

export class CreateRollDTO {
  @IsNotEmpty()
  @IsObjectId()
  readonly filamentId: TObjectId

  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(25)
  readonly color: string

  @IsString()
  @IsOptional()
  @MaxLength(500)
  readonly description: string
  
  @IsString()
  @IsOptional()
  @IsUrl()
  readonly url: string

  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(999)
  readonly coolingSpeed: number

  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(999)
  readonly printingTemperature: number

  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(999)
  readonly bedTemperature: number

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  @Max(999)
  @IsGreaterOrEqualThan('actualWeight')
  readonly defaultWeight: number

  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  readonly actualWeight: number

  @Min(1)
  @Max(10)
  @IsNumber()
  @IsOptional()
  readonly rating: number 

  @IsBoolean()
  @IsOptional()
  readonly isFinished: boolean

  @IsBoolean()
  @IsOptional()
  readonly isSample: boolean

  @IsBoolean()
  @IsOptional()
  readonly isActive: boolean
}
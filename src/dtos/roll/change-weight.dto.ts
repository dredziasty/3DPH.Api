import { IsNumber, IsPositive, IsNotEmpty } from 'class-validator'

export class ChangeWeightDTO {
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  readonly usedWeight: number
}
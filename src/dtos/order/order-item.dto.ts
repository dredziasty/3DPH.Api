import { IsNotEmpty, IsNumber, IsString, IsPositive } from 'class-validator'

export class OrderItemDTO {
  @IsNotEmpty()
  @IsString()
  readonly name: string
  
  @IsNotEmpty()
  @IsString()
  readonly color: string

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  readonly price: number
  
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  readonly amount: number
}
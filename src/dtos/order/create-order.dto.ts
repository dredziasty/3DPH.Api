import { Type } from 'class-transformer'
import { IsNotEmpty, IsNumber, IsString, ValidateNested, IsObject, IsArray, IsDateString, Min } from 'class-validator'
import { CreateCustomerDTO } from './create-customer.dto'
import { OrderItemDTO } from './order-item.dto'

export class CreateOrderDTO {
  @IsNotEmpty()
  @IsString()
  readonly name: string

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  readonly extraCost: number

  @IsNotEmpty()
  @IsString()
  readonly description: string

  @IsNotEmpty()
  @IsObject()
  @ValidateNested()
  @Type(() => CreateCustomerDTO)
  readonly customer: CreateCustomerDTO

  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDTO)
  readonly items: OrderItemDTO[]

  @IsNotEmpty()
  @IsDateString()
  readonly plannedCompletionAt: Date | string
}
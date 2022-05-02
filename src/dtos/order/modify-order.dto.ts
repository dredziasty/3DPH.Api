import { Type } from 'class-transformer'
import { IsNumber, IsString, ValidateNested, IsObject, IsArray, IsDateString, IsOptional, Min } from 'class-validator'
import { ModifyCustomerDTO } from './modify-customer.dto'
import { OrderItemDTO } from './order-item.dto'

export class ModifyOrderDTO {
  @IsOptional()
  @IsString()
  readonly name?: string

  @IsOptional()
  @IsNumber()
  @Min(0)
  readonly extraCost?: number

  @IsOptional()
  @IsString()
  readonly description?: string

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => ModifyCustomerDTO)
  readonly customer?: ModifyCustomerDTO

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDTO)
  readonly items?: OrderItemDTO[]

  @IsOptional()
  @IsDateString()
  readonly plannedCompletionAt?: Date | string
}
import { IsString,  IsOptional, MaxLength } from 'class-validator'

export class ModifyCustomerDTO {
  @IsOptional()
  @IsString()
  readonly name?: string

  @IsOptional()
  @IsString()
  @MaxLength(9)
  readonly phoneNumber?: string
}
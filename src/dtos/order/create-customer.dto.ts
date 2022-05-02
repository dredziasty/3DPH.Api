import { IsNotEmpty, IsString, MaxLength } from 'class-validator'

export class CreateCustomerDTO {
  @IsNotEmpty()
  @IsString()
  readonly name: string

  @IsNotEmpty()
  @IsString()
  @MaxLength(9)
  readonly phoneNumber: string
}
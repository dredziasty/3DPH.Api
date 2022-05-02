import { IsBoolean, IsNumber, IsOptional } from "class-validator";

export class RollsSettingsDTO {
  @IsNumber()
  @IsOptional()
  readonly id: number

  @IsBoolean()
  @IsOptional()
  readonly syncOnLogin: boolean
}
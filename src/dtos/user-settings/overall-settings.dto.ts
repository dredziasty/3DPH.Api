import { IsBoolean, IsNumber, IsOptional, IsString } from "class-validator";

export class OverallSettingsDTO {
  @IsString()
  @IsOptional()
  readonly language: string

  @IsString()
  @IsOptional()
  readonly currency: string

  @IsNumber()
  @IsOptional()
  readonly theme: number

  @IsBoolean()
  @IsOptional()
  readonly soundsGeneral: boolean
}
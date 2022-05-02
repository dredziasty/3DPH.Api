import { IsBoolean, IsNumber, IsOptional } from "class-validator";

export class ProjectsSettingsDTO {
  @IsNumber()
  @IsOptional()
  readonly id: number

  @IsBoolean()
  @IsOptional()
  readonly syncOnLogin: boolean
}
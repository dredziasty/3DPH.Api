import { Type } from "class-transformer";
import { IsObject, IsOptional, ValidateNested } from "class-validator";
import { OverallSettingsDTO } from "./overall-settings.dto";
import { OrdersSettingsDTO } from "./orders-settings.dto";
import { RollsSettingsDTO } from "./rolls-settings.dto";
import { ProjectsSettingsDTO } from "./projects-settings.dto";
import { NotificationsSettingsDTO } from "./notifications-settings.dto";

export class ModifyUserSettingsDTO {
  @IsObject()
  @IsOptional()
  @ValidateNested()
  @Type(() => OverallSettingsDTO)
  readonly overallSettings?: OverallSettingsDTO

  @IsObject()
  @IsOptional()
  @ValidateNested()
  @Type(() => OrdersSettingsDTO)
  readonly ordersSettings?: OrdersSettingsDTO

  @IsObject()
  @IsOptional()
  @ValidateNested()
  @Type(() => RollsSettingsDTO)
  readonly rollsSettings?: RollsSettingsDTO

  @IsObject()
  @IsOptional()
  @ValidateNested()
  @Type(() => ProjectsSettingsDTO)
  readonly projectsSettings?: ProjectsSettingsDTO

  @IsObject()
  @IsOptional()
  @ValidateNested()
  @Type(() => NotificationsSettingsDTO)
  readonly notificationsSettings?: NotificationsSettingsDTO
}
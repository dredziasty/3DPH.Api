import { IsBoolean, IsOptional } from "class-validator";

export class NotificationsSettingsDTO {
  @IsBoolean()
  @IsOptional()
  readonly isEnabled: boolean

  @IsBoolean()
  @IsOptional()
  readonly sounds: boolean

  @IsBoolean()
  @IsOptional()
  readonly newOrder: boolean
}
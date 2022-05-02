import { TObjectId } from '../../shared/types'
import { IMongoObjectBase } from '../other/mongo-object-base.interface';

export interface IOverallSettings {
  readonly language: string
  readonly currency: string
  readonly theme: number
  readonly soundsGeneral: boolean
}

export interface IRollsSettings {
  readonly syncOnLogin: boolean
}

export interface IOrdersSettings {
  readonly syncOnLogin: boolean
  readonly numbering: number
}

export interface IProjectsSettings {
  readonly syncOnLogin: boolean
}

export interface INotificationSettings {
  readonly isEnabled: boolean
  readonly sounds: boolean
  readonly newOrder: boolean
}

export interface IUserSettings extends IMongoObjectBase {
  readonly userId: TObjectId
  readonly overallSettings: IOverallSettings
  readonly rollsSettings: IRollsSettings
  readonly ordersSettings: IOrdersSettings
  readonly projectsSettings: IProjectsSettings
  readonly notificationsSettings: INotificationSettings
}
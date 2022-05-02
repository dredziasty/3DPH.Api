import { TObjectId } from '../../shared/types'

export interface IIds {
  readonly userId?: TObjectId
  readonly userSettingsId?: TObjectId
  readonly projectId?: TObjectId
  readonly fileId?: TObjectId
  readonly rollId?: TObjectId
  readonly filamentId?: TObjectId
  readonly orderId?: TObjectId
}
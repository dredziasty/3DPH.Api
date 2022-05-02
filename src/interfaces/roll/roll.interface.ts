import { TObjectId } from '../../shared/types'
import { IMongoObjectBase } from '../other/mongo-object-base.interface';

export interface IRoll extends IMongoObjectBase {
  readonly userId: TObjectId
  readonly filamentId: TObjectId
  readonly description: string
  readonly url: string
  readonly coolingSpeed: number
  readonly printingTemperature: number
  readonly bedTemperature: number
  readonly defaultWeight: number
  readonly actualWeight: number
  readonly usedWeight: number
  readonly rating: number
  readonly archivisedAt: Date | string | null
  readonly lastUsageAt: Date | string | null
  readonly isFinished: boolean
  readonly isSample: boolean
  readonly isActive: boolean
  readonly isDeleted: boolean
}
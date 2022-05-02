import { TObjectId } from '../../shared/types'
import { IMongoObjectBase } from '../other/mongo-object-base.interface';

interface IOrderItem {
  readonly _id: TObjectId
  readonly name: string
  readonly color: string
  readonly price: number
  readonly amount: number
}

interface ICustomer {
  readonly _id: TObjectId
  readonly name: string
  readonly phoneNumber: string
}

export interface IOrder extends IMongoObjectBase {
  readonly userId: TObjectId
  readonly name: string
  readonly number: number
  readonly value: number
  readonly extraCost: number
  readonly description: string
  readonly customer: ICustomer
  readonly items: IOrderItem[]
  readonly isDeleted: boolean
  readonly plannedCompletionAt: Date | string | null
  readonly completedAt: Date | string | null
  readonly archivisedAt: Date | string | null
}
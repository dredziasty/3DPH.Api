import { EHttpStatus, EServiceResult } from './enums'
import { HttpException } from './exceptions'
import { IRoll, IUser, IBearerTokens } from '../interfaces'
import { Document, FilterQuery, Model, Types } from 'mongoose'
import { IMongoObjectBase } from '../interfaces/other/mongo-object-base.interface'

export type TSuccessStatuses = EHttpStatus.OK | EHttpStatus.CREATED | EHttpStatus.NO_CONTENT

export type TResultSuccess<T> = {
  type: EServiceResult.SUCCESS
  value: T
  status: TSuccessStatuses
}

export type TResultError = {
  type: EServiceResult.ERROR
  error: HttpException
}

export type TResult<T> = TResultSuccess<T> | TResultError

export type TRollAndUser = {
  roll: IRoll
  user: IUser
}

export type TUserAndTokens = {
  user: IUser
  tokens: IBearerTokens
}

export type TAllRoll = {
  roll: IRoll
}

export type TExtendedModel<T> = Model<T & Document>

export type TObjectId = Types.ObjectId | string

export type TResponseType = 'json' | 'no-json' | 'download' | 'auth'

export type THeaderKey = 'Authorization' | 'Refresh-Token'

export type TToken = 'access' | 'refresh'

export type TDeleteType = 'soft' | 'hard' | undefined

export type TWritable<T> = {
  -readonly [K in keyof T]: T[K]
}

export type TQueryable<T> = FilterQuery<T & Document>

export type TRepo<T> = Omit<T, keyof IMongoObjectBase>

export type TRepoUser = TRepo<IUser>

export type DeepPartial<T> = T extends object ? {
  [P in keyof T]?: DeepPartial<T[P]>;
} : T;
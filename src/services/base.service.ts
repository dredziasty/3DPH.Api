import { EToken, EServiceResult, EHttpStatus } from "../shared/enums"
import { HttpException } from "../shared/exceptions"
import { TResultSuccess, TResultError, TToken, TWritable, TObjectId, TSuccessStatuses } from "../shared/types"
import * as config from '../config'
import { IIds } from '../interfaces'
import jwt from 'jsonwebtoken' 

export abstract class BaseService {
  private ids: TWritable<IIds> = {}

  constructor() { }

  protected successResult = <T>(value: T, status: TSuccessStatuses = EHttpStatus.OK): TResultSuccess<T> => {
    return { type: EServiceResult.SUCCESS, value, status }
  }

  protected errorResult = (error: HttpException): TResultError => {
    return { type: EServiceResult.ERROR, error }
  }

  protected verifyTokenMiddleware = (token: string, type: TToken) => {
    return jwt.verify(token, EToken.ACCESS === type ? config.ACCESS_TOKEN_SECRET : config.REFRESH_TOKEN_SECRET)
  }

  protected fixToken = (token: string): string => token.split(' ')[1]

  protected setId = (key: keyof IIds, value: TObjectId) => {
    if (value) this.ids[key] = value
    return this
  }

  protected getIds = () => {
    if (Object.keys(this.ids).length === 0) throw new HttpException(EHttpStatus.INTERNAL_SERVER_ERROR, 'Ids object is empty')
    return { ...this.ids }
  }

  protected clearIds = () => {
    this.ids = {}
  }
}
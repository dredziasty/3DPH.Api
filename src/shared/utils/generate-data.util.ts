import { ITokenPayload } from "../../interfaces"
import jwt from 'jsonwebtoken'
import * as config from '../../config'
import { EToken } from "../enums"
import { TToken } from '../types'

export const generateRestoreCode = (): string =>
  Math.random().toString(36).substr(2, 9).toLocaleUpperCase()

export const generateExpiresIn = (seconds: number): string =>
  new Date(new Date().getTime() + (seconds * 1000)).toISOString()

export const generateBearerToken = (payload: ITokenPayload | null, type: TToken): string => {
  const secret: string = type === EToken.REFRESH ? config.REFRESH_TOKEN_SECRET : config.ACCESS_TOKEN_SECRET
  const life: string | number = type === EToken.REFRESH ? config.REFRESH_TOKEN_LIFE : config.ACCESS_TOKEN_LIFE

  return `Bearer ${jwt.sign({ ...payload }, secret, { expiresIn: life })}`
}
  

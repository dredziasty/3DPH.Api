import { HttpException, InvalidTokenException } from '../shared/exceptions'
import { Request, Response, NextFunction, RequestHandler } from 'express'
import { THeaderKey } from '../shared/types'
import { EHeaderKey, EHttpStatus } from '../shared/enums'
import jwt from 'jsonwebtoken'
import jwtDecode from 'jwt-decode'
import * as config from '../config'
import { default as redis } from '../redis'
import { ITokenPayload } from '../interfaces'

export const verifyTokenMiddleware = (headerKey: THeaderKey): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const bearerToken: string | undefined = <string | undefined>req.headers[headerKey.toLocaleLowerCase()]

    if (!bearerToken) return next(new HttpException(EHttpStatus.BAD_REQUEST, 'There is no token in header', [headerKey]))

    const userToken: string = bearerToken.split(' ')[1]

    try {

      jwt.verify(
        userToken,
        headerKey === EHeaderKey.AUTHORIZATION ?
          config.ACCESS_TOKEN_SECRET :
          config.REFRESH_TOKEN_SECRET
      )

    } catch (error: any) {

      if (headerKey === EHeaderKey.REFRESH_TOKEN) {
        const tokenData: ITokenPayload = jwtDecode(userToken)
        const redisKey = `refresh-token/${tokenData._id}`
        const cachedTokenData = await redis.getAsync(redisKey)

        if (!cachedTokenData) return next(new InvalidTokenException([headerKey]))

        const newCachedTokenData = cachedTokenData.split(';').filter(_token => _token !== userToken).join(';')
        await redis.setAsync(redisKey, newCachedTokenData)
      }

      return next(new InvalidTokenException([headerKey]))
      
    }

    return next()
  }
}
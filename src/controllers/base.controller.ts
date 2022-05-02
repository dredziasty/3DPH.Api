import stream from 'stream'
import jwtDecode from 'jwt-decode'
import { IncomingHttpHeaders } from 'http'
import { Request, Response, NextFunction, RequestHandler, Router } from "express"
import { IBearerTokens, IControllerBase, IFile, ITokenPayload } from '../interfaces'
import { HttpException } from '../shared/exceptions'
import { TObjectId, THeaderKey, TResult, TResponseType } from '../shared/types'
import { EHeaderKey, EHttpStatus, EServiceResult, EResponseType } from '../shared/enums'
import { isBearerTokens, isFile } from '../shared/guards'


export abstract class BaseController implements IControllerBase {
  public path: string
  public router: Router

  constructor() { }

  protected getIdFromHeader = (headers: IncomingHttpHeaders, headerKey: THeaderKey = EHeaderKey.AUTHORIZATION): TObjectId => {
    const token = <string>headers[headerKey.toLowerCase()]

    const tokenData: ITokenPayload = jwtDecode(token)

    return tokenData?._id
  }

  protected sendResponse = <T>(type: TResponseType, result: TResult<T>, res: Response, next: NextFunction) => {
    if (result.type === EServiceResult.ERROR) return next(result.error)

    switch (type) {
      case EResponseType.JSON:
        return res.status(result.status).json({ value: result.value })

      case EResponseType.NO_JSON:
        return res.status(result.status).send()

      case EResponseType.AUTH:
        if (isBearerTokens(result.value)) {
          const tokens = result.value as IBearerTokens

          return [
            res.setHeader('Authorization', <string>tokens.bearerAccessToken),
            res.setHeader('Refresh-Token', <string>tokens.bearerRefreshToken),
            res.status(result.status).send()
          ]
        }

      case EResponseType.DOWNLOAD:
        if (isFile(result.value)) {
          const { content, name, extension } = result.value as IFile

          if (!content) return next(new HttpException(EHttpStatus.INTERNAL_SERVER_ERROR, 'No file content'))

          const readStream = new stream.PassThrough()
          readStream.end(content)

          res.setHeader('Content-Disposition', `attachment; filename=${name}.${extension}`)
          res.setHeader('Content-Type', 'text/plain')
          res.setHeader('Content-Length', content.byteLength)
          res.status(result.status)

          return readStream.pipe(res)
        }

      default:
        return next(new HttpException())
    }
  }

  protected catchAsync = (fn: any): RequestHandler => {
    return (req: Request, res: Response, next: NextFunction) => {
      fn(req, res, next).catch((err: HttpException) => next(new HttpException(err.status, err.message, err.issues)))
    }
  }
}
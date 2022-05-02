import { HttpException } from '../shared/exceptions'
import { Request, Response, NextFunction, RequestHandler } from 'express'

export const verifyUploadedFileMiddleware = (fieldKey: string, extensions?: Array<string> | undefined): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const reqKey = req.file?.fieldname
    
    if (reqKey !== fieldKey) {
      return next(new HttpException(400, `Invalid key name; is ${reqKey}, should be ${fieldKey}`))
    }

    if (!req.file?.buffer) {
      return next(new HttpException(400, 'Buffer is empty'))
    }

    if (!extensions?.includes(req.body.extension)) {
      return next(new HttpException(400, `Invalid file extension`, ['extension']))
    }

    return next()
  }
}
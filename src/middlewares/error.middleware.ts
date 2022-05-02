import { Request, Response, NextFunction } from 'express'
import { HttpException } from '../shared/exceptions'
import * as config from '../config'
import { IErrorMessage } from '../interfaces'
import { EHttpStatus } from '../shared/enums'

export const errorMiddleware = (error: HttpException, req: Request, res: Response, next: NextFunction) => {
  const { status, message, stack, issues } = error

  const errorMessage: IErrorMessage = {
    status: status || EHttpStatus.INTERNAL_SERVER_ERROR,
    message,
    issues
  }

  if (config.NODE_ENV === 'development') {
    errorMessage.stack = stack
  }

  res.status(errorMessage.status).json({ ...errorMessage })
}
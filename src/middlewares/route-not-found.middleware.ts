import { Request, Response, NextFunction } from 'express'
import { IErrorMessage } from '../interfaces'
import { EHttpStatus } from '../shared/enums'

export const routeNotFoundMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const error: IErrorMessage = {
    status: EHttpStatus.NOT_FOUND,
    message: `Route ${req.url} not found.`,
    issues: ['url']
  }

  res.status(error.status).json(error)
}
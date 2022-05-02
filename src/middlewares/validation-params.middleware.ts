import { HttpException } from "../shared/exceptions";
import { EHttpStatus } from '../shared/enums'
import { RequestHandler, Request, Response, NextFunction } from "express";
import { isValidObjectId } from "mongoose";

export const validationParamsMiddleware = (...paramKeys: string[]): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    const issues: string[] = []
    const messages: string[] = []

    paramKeys.forEach(paramKey => {
      const paramValue = req.params[paramKey]
      const objectIdRegex = new RegExp(/^\w+(Id)$/, 'gm')

      if (!paramValue || !paramValue.trim()) {
        issues.push(paramKey)
        messages.push(`Param ${paramKey} is required.`)
      }

      if (paramKey.match(objectIdRegex) && !isValidObjectId(paramValue)) {
        if (!issues.includes(paramKey)) issues.push(paramKey)
        messages.push(`Param ${paramKey} must be valid objectId`)
      }
    })

    if (issues.length) {
      return next(new HttpException(EHttpStatus.BAD_REQUEST, messages.join(' '), issues))
    }

    next()
  }
}
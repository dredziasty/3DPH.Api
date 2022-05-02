import { Request, Response, NextFunction, RequestHandler } from 'express'
import { validate, ValidationError } from 'class-validator'
import { plainToClass } from 'class-transformer'
import { HttpException } from '../shared/exceptions'
import { IValidateOptions } from '../interfaces'

const getMessages = (array: ValidationError[]): string[] => {
  return array.map((error: ValidationError) => {
    const prefix = error.children?.length ? `${error.property}.` : ''
    return (error.children?.length ?
      error.children.map((e: ValidationError) => getMessages([e])) :
      Object.values(error.constraints ?? {}))
      .flat()
      .map(item => `${prefix}${item}`)
  }).flat()
}

const getIssues = (array: ValidationError[]): string[] => {
  return array.map((error: ValidationError) => {
    const prefix = error.children?.length ? `${error.property}.` : ''
    return (error.children?.length ?
      error.children.map((e: ValidationError) => getIssues([e])) :
      [error.property])
      .flat()
      .map(item => `${prefix}${item}`)
  }).flat()
}

export const validationDTOMiddleware = (type: any, options: IValidateOptions | null = null): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    validate(plainToClass(type, req.body), { ...options, whitelist: true, forbidNonWhitelisted: true })
      .then((errors: ValidationError[]) => {
        if (errors.length > 0) {
          const messages: string[] = getMessages(errors)
          const issues: string[] = getIssues(errors)

          return next(new HttpException(400, messages.join(', '), issues))
        }

        next()
      })
  }
}

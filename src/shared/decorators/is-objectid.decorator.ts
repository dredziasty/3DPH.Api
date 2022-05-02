import { ValidationOptions, ValidateBy, buildMessage } from 'class-validator'
import { isValidObjectId } from 'mongoose'

export const IS_OBJECTID = 'isObjectId'

export function isObjectId(value: unknown): boolean {
  return typeof value === 'string' && isValidObjectId(value)
}

export function IsObjectId(options?: any, validationOptions?: ValidationOptions): PropertyDecorator {
  return ValidateBy(
    {
      name: IS_OBJECTID,
      constraints: [options],
      validator: {
        validate: (value): boolean => isObjectId(value),
        defaultMessage: buildMessage(eachPrefix => eachPrefix + '$property isn\'t valid ObjectId', validationOptions)
      }
    },
    validationOptions
  )
}
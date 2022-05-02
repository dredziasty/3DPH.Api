import { ValidatorOptions, ValidateBy, buildMessage, ValidationArguments } from "class-validator";

export const IS_GREATER_OR_EQUAL_THAN = 'isGreaterOrEqualThan'

export function isGreaterOrEqualThan(greaterValue: unknown, lowerValue: unknown): boolean {
  return typeof lowerValue === 'number' &&
    typeof greaterValue === 'number' &&
    greaterValue >= lowerValue
}

export function IsGreaterOrEqualThan(property: string, validationOptions?: ValidatorOptions) {
  return ValidateBy(
    {
      name: IS_GREATER_OR_EQUAL_THAN,
      constraints: [property],
      validator: {
        validate: (value: any, args: ValidationArguments): boolean => {
          const [lowerPropertyName] = args.constraints
          const lowerValue = (args.object as any)[lowerPropertyName]
          return isGreaterOrEqualThan(value, lowerValue)
        },
        defaultMessage: buildMessage((eachPrefix: string, args?: ValidationArguments) => {
          console.log(args)
          return eachPrefix + '$property must be greater or equal than ';
        }, validationOptions)
      }
    }
  )
}
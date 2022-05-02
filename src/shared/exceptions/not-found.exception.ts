import { HttpException } from '.'
import { EHttpStatus } from '../enums'

export default class NotFoundException extends HttpException {
  constructor(field: string, issues: string[] = []) {
    super(EHttpStatus.NOT_FOUND, `${field} not found`, issues.length === 0 ? [field.toLocaleLowerCase()] : issues)
  }
}
import { HttpException } from '.'
import { EHttpStatus } from '../enums'

export default class InvalidTokenException extends HttpException {
  constructor(issues: string[]) {
    super(EHttpStatus.UNAUTHORIZED, `Token is invalid`, issues)
  }
}
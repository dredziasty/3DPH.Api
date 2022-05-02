import { EHttpStatus } from '../enums'
import { HttpException } from '.'

export default class MethodNotAllowedException extends HttpException {
  constructor() {
    super(EHttpStatus.METHOD_NOT_ALLOWED, `This method is not allowed`)
  }
}
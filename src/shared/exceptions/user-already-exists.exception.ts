import { EHttpStatus } from '../enums'
import { HttpException } from '.'

export default class UserAlreadyExistsException extends HttpException {
  constructor(issues: string[]) {
    super(EHttpStatus.CONFLICT, 'User with that email or username already exists.', issues)
  }
}
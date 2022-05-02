import { HttpException } from '.'
import { EHttpStatus } from '../enums'

export default class ObjectIsDeletedException extends HttpException {
  constructor() {
    super(EHttpStatus.BAD_REQUEST, 'Cannot soft-delete this object / these objects', ['isDeleted'])
  }
}
import { HttpException } from '.'

export default class RepositoryException extends HttpException {
  constructor(error: any) {
    super(error.status, error.message)
  }
}
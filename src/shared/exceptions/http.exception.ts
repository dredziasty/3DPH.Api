import { EHttpStatus } from "../enums"

export default class HttpException extends Error {
  public status: number
  public message: string
  public stack: string
  public issues: string[]

  constructor(
    status?: number,
    message?: string,
    issues?: string[]
  ) {
    super(message)
    this.status = status ?? EHttpStatus.INTERNAL_SERVER_ERROR
    this.message = message ?? 'Something went wrong'
    this.stack = (new Error()).stack ?? 'No stack'
    this.issues = issues ?? []
  }
}
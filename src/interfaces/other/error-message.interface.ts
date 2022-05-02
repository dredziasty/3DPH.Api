export interface IErrorMessage {
  status: number
  message: string
  stack?: string
  issues: string[]
}
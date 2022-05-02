import { JwtPayload } from "jsonwebtoken";
import { HttpException } from "../../shared/exceptions";
import { TObjectId, TResultError, TResultSuccess, TSuccessStatuses, TToken } from "../../shared/types";
import { IIds } from "./ids.interface";

export interface IServiceBase {
  successResult<T>(value: T, status: TSuccessStatuses): TResultSuccess<T>
  errorResult(error: HttpException): TResultError
  verifyTokenMiddleware(token: string, type: TToken): string | JwtPayload
  fixToken(token: string): string
  setId(key: keyof IIds, value: TObjectId): this
  getIds(): IIds
  clearIds(): void
}
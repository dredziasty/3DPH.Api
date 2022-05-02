import { TUserAndTokens } from "./types"
import { IBearerTokens, IFile } from "../interfaces"

export const isUserAndTokens = (object: any): object is TUserAndTokens => 'user' in object && 'tokens' in object

export const isBearerTokens = (object: any): object is IBearerTokens => 'bearerAccessToken' in object || 'bearerRefreshToken' in object

export const isFile = (object: any): object is IFile => 'extension' in object
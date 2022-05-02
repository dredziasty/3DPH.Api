export enum EServiceResult {
  ERROR = 'error',
  SUCCESS = 'success'
}

export enum EEnv { 
  PRODUCTION = 'production',
  DEVELOPMENT = 'development'
}

export enum EHttpStatus {
  OK = 200,
  CREATED = 201,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  METHOD_NOT_ALLOWED = 405,
  CONFLICT = 409,
  INTERNAL_SERVER_ERROR = 500,
  NOT_IMPLEMENTED = 501,
  BAD_GATEWAY = 502,
  SERVICE_UNAVAILABLE = 503
}

export enum EResponseType {
  JSON = 'json',
  AUTH = 'auth',
  DOWNLOAD = 'download',
  NO_JSON = 'no-json'
}

export enum EHeaderKey {
  AUTHORIZATION = 'Authorization',
  REFRESH_TOKEN = 'Refresh-Token'
}

export enum EToken {
  ACCESS = 'access',
  REFRESH = 'refresh'
}

export enum EDeleteType {
  SOFT = 'soft',
  HARD = 'hard'
}
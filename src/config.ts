export const MONGODB_URI: string = <string>process.env.MONGODB_URI

export const ACCESS_TOKEN_SECRET: string = <string>process.env.ACCESS_TOKEN_SECRET
export const REFRESH_TOKEN_SECRET: string = <string>process.env.REFRESH_TOKEN_SECRET
export const ACCESS_TOKEN_LIFE: (string | number) = <string | number>process.env.ACCESS_TOKEN_LIFE
export const REFRESH_TOKEN_LIFE: (string | number) = <string | number>process.env.REFRESH_TOKEN_LIFE

export const PORT: number = parseInt(<string>process.env.PORT)
export const SALT: number = parseInt(<string>process.env.SALT)
export const NODE_ENV: string = <string>process.env.NODE_ENV

export const MAIL_HOST: string = <string>process.env.MAIL_HOST
export const MAIL_PORT: number = parseInt(<string>process.env.MAIL_PORT)
export const MAIL_USER: string = <string>process.env.MAIL_USER
export const MAIL_PASS: string = <string>process.env.MAIL_PASS

export const AWS_ACCESS_KEY_ID: string = <string>process.env.AWS_ACCESS_KEY_ID
export const AWS_SECRET_ACCESS_KEY: string = <string>process.env.AWS_SECRET_ACCESS_KEY
export const AWS_BUCKET: string = <string>process.env.AWS_BUCKET
export const AWS_REGION: string = <string>process.env.AWS_REGION

export const REDIS_URL: string = <string>process.env.REDIS_URL

export const PROJECT_EXTENSIONS: Array<string> = ['dwg', 'dxf', 'dwf', 'igs', 'stp', 'step', '3ds', 'blend', 'dae', 'ipt', 'obj', 'skp', 'fbx', 'lwo', 'off', 'ply', 'stl', 'amf', 'x3d']

export const API_VERSION: string = '0.5-dev'
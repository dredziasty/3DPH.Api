import { IMongoObjectBase } from '../other/mongo-object-base.interface';

export interface IUser extends IMongoObjectBase  {
  readonly username: string
  readonly email: string
  readonly password: string
  readonly restorePassword?: { code: string, expiresIn: Date | String }
}
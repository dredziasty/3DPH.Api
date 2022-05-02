import { IMongoObjectBase } from "../other/mongo-object-base.interface";

export interface IFile extends IMongoObjectBase {
  readonly name: string
  readonly extension: string
  readonly content?: Buffer
}
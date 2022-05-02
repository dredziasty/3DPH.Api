import { TObjectId } from '../../shared/types'
import { IFile } from '..'
import { IMongoObjectBase } from '../other/mongo-object-base.interface'

export interface IProject extends IMongoObjectBase {
  readonly userId: TObjectId
  readonly name: string,
  readonly shortDescription: string,
  readonly description: string,
  readonly files: Array<IFile>
  readonly isDeleted: boolean
}
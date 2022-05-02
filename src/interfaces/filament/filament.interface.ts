import { TObjectId } from "../../shared/types";
import { IMongoObjectBase } from "../other/mongo-object-base.interface";

export interface IFilament extends IMongoObjectBase {
  readonly userId: TObjectId
  readonly type: string
  readonly brand: string
  readonly diameter: number
  readonly color: string
  readonly colorHex: string
  readonly name: string
  readonly description: string
  readonly isDeleted: boolean 
}
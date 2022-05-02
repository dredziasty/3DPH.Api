import { TObjectId } from "../../shared/types";

export class IMongoObjectBase {
  readonly _id: TObjectId
  readonly createdAt: Date | string
  readonly updatedAt: Date | string
}
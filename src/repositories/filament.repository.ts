import { ClientSession } from "mongoose";
import { IFilament } from "../interfaces";
import { NotFoundException, ObjectIsDeletedException } from "../shared/exceptions";
import { TExtendedModel, TObjectId, TQueryable } from "../shared/types";

export class FilamentRepository {
  constructor(
    private readonly filamentModel: TExtendedModel<IFilament>
  ) { }

  public findFilaments = async (userId: TObjectId, session?: ClientSession): Promise<IFilament[]> => {
    const query: TQueryable<IFilament> = { userId, isDeleted: false }
    const filaments = await this.filamentModel.find(query, null, { session }).lean()

    if (!filaments)
      throw new NotFoundException("Filaments")

    return filaments
  }

  public findFilament = async (_id: TObjectId, userId: TObjectId, session?: ClientSession): Promise<IFilament> => {
    const query: TQueryable<IFilament> = { _id, userId, isDeleted: false }
    const filament = await this.filamentModel.findOne(query, null, { session }).lean()

    if (!filament)
      throw new NotFoundException("Filament", ["_id"])

    return filament
  }

  public createFilament = async (filamentData: Partial<IFilament>, session?: ClientSession): Promise<TObjectId> => {
    const filament = new this.filamentModel({
      ...filamentData
    })

    await filament.save({ session })

    return filament._id
  }

  public modifyFilament = async (_id: TObjectId, userId: TObjectId, filamentData: Partial<IFilament>, session?: ClientSession): Promise<TObjectId> => {
    const query: TQueryable<IFilament> = { _id, userId, isDeleted: false }
    const filament = await this.filamentModel.findOne(query, null, { session })

    if (!filament)
      throw new NotFoundException("Filament", ["_id"])

    await filament.updateOne({
      $set: { ...filamentData }
    }, { session })

    return filament._id
  }

  public softDeleteFilament = async (_id: TObjectId, userId: TObjectId, session?: ClientSession): Promise<void> => {
    const filamentQuery: TQueryable<IFilament> = { _id, userId }
    const filament = await this.filamentModel.findOne(filamentQuery, null, { session })

    if (!filament)
      throw new NotFoundException("Filament", ["_id"])
    if (filament.isDeleted)
      throw new ObjectIsDeletedException()

    await filament.updateOne({
      $set: { isDeleted: true }
    }, { session })
  }

  public hardDeleteFilament = async (_id: TObjectId, userId: TObjectId, session?: ClientSession): Promise<void> => {
    const query: TQueryable<IFilament> = { _id, userId }
    await this.filamentModel.deleteOne(query, { session })
  }

  public deleteFilaments = async (userId: TObjectId, session?: ClientSession): Promise<void> => {
    const query: TQueryable<IFilament> = { userId }
    await this.filamentModel.deleteMany(query, { session })
  }
}
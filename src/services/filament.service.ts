import { startSession } from "mongoose";
import { IFilament, IIds } from "../interfaces";
import { FilamentRepository, RollRepository } from "../repositories";
import { TDeleteType, TObjectId, TResult } from "../shared/types";
import { BaseService } from "./base.service";
import { CreateFilamentDTO, ModifyFilamentDTO } from "../dtos"
import { EDeleteType, EHttpStatus } from "../shared/enums";
import { HttpException } from "../shared/exceptions";

export class FilamentService extends BaseService {
  constructor(
    private readonly filamentRepository: FilamentRepository,
    private readonly rollRepository: RollRepository
  ) {
    super()
  }

  public getFilaments = async (userId: TObjectId): Promise<TResult<IFilament[]>> => {
    try {

      const filaments = await this.filamentRepository.findFilaments(userId)
      return this.successResult(filaments)

    } catch (error: any) {

      return this.errorResult(error)

    }
  }

  public getFilament = async (_id: TObjectId, userId: TObjectId): Promise<TResult<IFilament>> => {
    try {

      const filament = await this.filamentRepository.findFilament(_id, userId)
      return this.successResult(filament)

    } catch (error: any) {

      return this.errorResult(error)

    }
  }

  public createFilament = async (userId: TObjectId, createFilamentDTO: CreateFilamentDTO): Promise<TResult<IIds>> => {
    try {

      const filamentData: Partial<IFilament> = { userId, ...createFilamentDTO }
      const filamentId = await this.filamentRepository.createFilament(filamentData)

      this.setId('filamentId', filamentId)
      return this.successResult(this.getIds(), EHttpStatus.CREATED)

    } catch (error: any) {
      
      return this.errorResult(error)

    } finally {

      this.clearIds()

    }
  }

  public modifyFilament = async (_id: TObjectId, userId: TObjectId, modifyFilamentDTO: ModifyFilamentDTO): Promise<TResult<IIds>> => {
    try {
      const filamentId = await this.filamentRepository.modifyFilament(_id, userId, modifyFilamentDTO)

      this.setId('filamentId', filamentId)
      return this.successResult(this.getIds())

    } catch (error: any) {

      return this.errorResult(error)

    } finally {
      
      this.clearIds()

    }
  }

  public deleteFilament = async (_id: TObjectId, userId: TObjectId, deleteType: TDeleteType): Promise<TResult<boolean>> => {
    const session = await startSession()
    session.startTransaction()

    try {

      switch (deleteType) {
        case EDeleteType.SOFT:
          await this.filamentRepository.softDeleteFilament(_id, userId, session)
          await this.rollRepository.softDeleteRollOrRolls(null, userId, _id, session)
          break

        case EDeleteType.HARD:
          await this.filamentRepository.hardDeleteFilament(_id, userId, session)
          await this.rollRepository.hardDeleteRollOrRolls(null, userId, _id, session)
          break

        default:
          throw new HttpException(EHttpStatus.BAD_REQUEST, 'Missing type of delete')
      }

      await session.commitTransaction()
      return this.successResult(true, EHttpStatus.NO_CONTENT)

    } catch (error: any) {

      await session.abortTransaction()
      return this.errorResult(error)

    } finally {

      session.endSession()
      
    }
  }
}

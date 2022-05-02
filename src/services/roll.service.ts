import { BaseService } from './base.service'
import { CreateRollDTO, ModifyRollDTO, ChangeWeightDTO } from '../dtos'
import { IIds, IRoll } from '../interfaces'
import { HttpException } from '../shared/exceptions'
import { TResult, TObjectId, TDeleteType } from '../shared/types'
import { EHttpStatus, EDeleteType } from '../shared/enums'
import { RollRepository } from '../repositories'
import { startSession } from 'mongoose'

export class RollService extends BaseService {
  constructor(
    private readonly rollRepository: RollRepository,
  ) {
    super()
  }

  public getRollsByFilamentId = async (userId: TObjectId, filamentId: TObjectId): Promise<TResult<IRoll[]>> => {
    try {
      
      const rolls = await this.rollRepository.findRollsByFilamentId(filamentId, userId)
      return this.successResult(rolls)

    } catch (error: any) {

      return this.errorResult(error)

    }
  }

  public getRollById = async (_id: TObjectId, userId: TObjectId): Promise<TResult<IRoll>> => {
    try {

      const roll = await this.rollRepository.findRoll(_id, userId)
      return this.successResult(roll)

    } catch (error: any) {

      return this.errorResult(error)

    }
  }

  public createRoll = async (userId: TObjectId, createRollDTO: CreateRollDTO): Promise<TResult<IIds>> => {
    try {

      const rollData: Partial<IRoll> = { userId, ...createRollDTO }
      const rollId = await this.rollRepository.createRoll(rollData)

      this.setId('rollId', rollId)
      return this.successResult(this.getIds(), EHttpStatus.CREATED)

    } catch (error: any) {
      
      return this.errorResult(error)

    } finally {

      this.clearIds()

    }
  }

  public modifyRoll = async (_id: TObjectId, userId: TObjectId, modifyRollDTO: ModifyRollDTO): Promise<TResult<IIds>> => {
    try {

      const rollId = await this.rollRepository.modifyRoll(_id, userId, modifyRollDTO)

      this.setId('rollId', rollId)
      return this.successResult(this.getIds())

    } catch (error: any) {

      return this.errorResult(error)

    } finally {

      this.clearIds()

    }
  }

  public deleteRoll = async (_id: TObjectId, userId: TObjectId, deleteType: TDeleteType): Promise<TResult<boolean>> => {
    try {

      switch (deleteType) {
        case EDeleteType.SOFT:
          await this.rollRepository.softDeleteRollOrRolls(_id, userId)
          break

        case EDeleteType.HARD:
          await this.rollRepository.hardDeleteRollOrRolls(_id, userId)
          break

        default:
          throw new HttpException(EHttpStatus.BAD_REQUEST, 'Missing type of delete')
      }

      return this.successResult(true, EHttpStatus.NO_CONTENT)

    } catch (error: any) {

      return this.errorResult(error)

    }
  }

  public archiviseRoll = async (_id: TObjectId, userId: TObjectId): Promise<TResult<IIds>> => {
    try {

      const rollData: Partial<IRoll> = {
        archivisedAt: new Date().toISOString()
      }
      const rollId = await this.rollRepository.modifyRoll(_id, userId, rollData)

      this.setId('rollId', rollId)
      return this.successResult(this.getIds())
    } catch (error: any) {

      return this.errorResult(error)

    } finally {

      this.clearIds()

    }
  }

  public calculateWeight = async (_id: TObjectId, userId: TObjectId, changeWeightDTO: ChangeWeightDTO): Promise<TResult<IIds>> => {
    const session = await startSession()
    session.startTransaction()

    try {

      const roll = await this.rollRepository.findRoll(_id, userId, session)

      const newActualWeight = roll.actualWeight - changeWeightDTO.usedWeight
      const newUsedWeight = roll.usedWeight + changeWeightDTO.usedWeight

      if (newActualWeight < 0) {
        throw new HttpException(EHttpStatus.BAD_REQUEST, 'Not enough filament on roll.', ['actualWeight'])
      }

      const rollData: Partial<IRoll> = {
        actualWeight: newActualWeight,
        usedWeight: newUsedWeight,
        ...(!roll.isActive) && { isActive: true }
      }

      const rollId = await this.rollRepository.modifyRoll(_id, userId, rollData, session)

      this.setId('rollId', rollId)
      return this.successResult(this.getIds())

    } catch (error: any) {

      return this.errorResult(error)

    } finally {

      this.clearIds()

    }
  }
}
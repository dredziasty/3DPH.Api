import { ClientSession, Types } from "mongoose";
import { IRoll, IRollStatisticsAggregate } from "../interfaces";
import { EHttpStatus } from "../shared/enums";
import { HttpException, NotFoundException, ObjectIsDeletedException } from "../shared/exceptions";
import { TExtendedModel, TObjectId, TQueryable } from "../shared/types";

export class RollRepository {
  constructor(
    private readonly rollModel: TExtendedModel<IRoll>
  ) { }

  public findRollsByFilamentId = async (filamentId: TObjectId, userId: TObjectId, session?: ClientSession): Promise<IRoll[]> => {
    const query: TQueryable<IRoll> = { filamentId, userId, isDeleted: false }
    const rolls = await this.rollModel.find(query, null, { session }).lean()

    if (!rolls)
      throw new NotFoundException("Rolls")

    return rolls
  }

  public findRoll = async (_id: TObjectId, userId: TObjectId, session?: ClientSession): Promise<IRoll> => {
    const query: TQueryable<IRoll> = { _id, userId, isDeleted: false }
    const roll = await this.rollModel.findOne(query, null, { session }).lean()

    if (!roll)
      throw new NotFoundException("Roll", ["_id"])

    return roll
  }

  public createRoll = async (rollData: Partial<IRoll>, session?: ClientSession): Promise<TObjectId> => {
    const roll = new this.rollModel({
      ...rollData
    })

    await roll.save({ session })

    return roll._id
  }

  public modifyRoll = async (_id: TObjectId, userId: TObjectId, rollData: Partial<IRoll>, session?: ClientSession): Promise<TObjectId> => {
    const query: TQueryable<IRoll> = { _id, userId, isDeleted: false }
    const roll = await this.rollModel.findOne(query, null, { session })

    if (!roll)
      throw new NotFoundException("Roll", ["_id"])

    await roll.updateOne({
      $set: {
        ...rollData
      }
    })

    return roll._id
  }

  public softDeleteRollOrRolls = async (_id: TObjectId | null, userId: TObjectId, filamentId?: TObjectId | null, session?: ClientSession): Promise<void> => {
    const query: TQueryable<IRoll> = { userId, ...(_id && { _id }), ...(filamentId && { filamentId }) }
    const result = await this.rollModel.find(query, null, { session })

    if (!result)
      throw new NotFoundException(
        _id ? 'Roll' : 'Rolls',
        _id ? ['_id'] : []
      )
    if (result.every(r => r.isDeleted))
      throw new ObjectIsDeletedException()
    
    for await (let roll of result) {
      roll.updateOne({
        $set: { isDeleted: true }
      }, { session })
    }
  }

  public hardDeleteRollOrRolls = async (_id: TObjectId | null, userId: TObjectId, filamentId?: TObjectId | null, session?: ClientSession): Promise<void> => {
    const query: TQueryable<IRoll> = { userId, ...(_id && { _id }), ...(filamentId && { filamentId }) }
    await this.rollModel.deleteMany(query, { session })
  }

  public aggregateRollStatistics = async (filamentId: TObjectId, userId: TObjectId, session?: ClientSession): Promise<IRollStatisticsAggregate> => {
    const aggregateResults = await this.rollModel.aggregate([
      {
        $match: { filamentId, userId: Types.ObjectId(<string>userId) }
      },
      {
        $facet: {
          1: [
            {
              $group: {
                _id: "$userId",
                totalActualWeight: { $sum: "$actualWeight" },
                totalUsedWeight: { $sum: "$usedWeight" },
                overallRating: { $avg: "$rating" }
              }
            }
          ],
          2: [
            { $match: { filamentCoolingSpeed: { $gt: 0 } } },
            { $sort: { updatedAt: -1 } },
            {
              $group: {
                _id: "$userId",
                lastCoolingSpeed: { $first: "$filamentCoolingSpeed" }
              }
            }
          ],
          3: [
            { $match: { filamentPrintingTemperature: { $gt: 0 } } },
            { $sort: { updatedAt: -1 } },
            {
              $group: {
                _id: "$userId",
                lastPrintingTemperature: { $first: "$filamentPrintingTemperature" }
              }
            }
          ],
          4: [
            { $match: { filamentBedTemperature: { $gt: 0 } } },
            { $sort: { updatedAt: -1 } },
            {
              $group: {
                _id: "$userId",
                lastBedTemperature: { $first: "$filamentBedTemperature" }
              }
            }
          ]
        }
      }
    ])

    if (!aggregateResults || aggregateResults.length === 0)
      throw new HttpException(EHttpStatus.BAD_REQUEST, 'An error occurred while aggregating the statistics', ['filamentId'])

    const rollStatisticsAggregate = {} as IRollStatisticsAggregate

    aggregateResults.map(aggRes => {
      Object.values(aggRes).flat().map((aggItem) => {
        Object.entries(aggItem as unknown as object).map(([key, value]) => {
          if (key in rollStatisticsAggregate) {
            return
          }
          (rollStatisticsAggregate as any)[key] = value
        })
      })
    })

    return rollStatisticsAggregate
  }
}
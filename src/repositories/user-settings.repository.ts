import { ClientSession } from 'mongoose';
import { IUserSettings } from '../interfaces';
import { NotFoundException } from '../shared/exceptions';
import { DeepPartial, TExtendedModel, TObjectId, TQueryable } from '../shared/types'

export class UserSettingsRepository {
  constructor(
    private readonly userSettingsModel: TExtendedModel<IUserSettings>
  ) { }

  public findUserSettings = async (userId: TObjectId, session?: ClientSession): Promise<IUserSettings> => {
    const query: TQueryable<IUserSettings> = { userId }
    const userSettings = await this.userSettingsModel.findOne(query, null, { session })
    if (!userSettings)
      throw new NotFoundException('UserSettings', ['userId'])

    return userSettings
  }

  public createUserSettings = async (userId: TObjectId, session?: ClientSession): Promise<TObjectId> => {
    const userSettings = new this.userSettingsModel({
      userId
    })

    await userSettings.save({ session })

    return userSettings._id
  }

  public modifyUserSettings = async (userId: TObjectId, userSettingsData: DeepPartial<IUserSettings>, session?: ClientSession): Promise<TObjectId> => {
    const query: TQueryable<IUserSettings> = { userId }
    const userSettings = await this.userSettingsModel.findOneAndUpdate(
      query,
      { $set: { ...userSettingsData } },
      { new: true, session }
    )
    if (!userSettings)
      throw new NotFoundException('UserSettings', ['userId'])

    return userSettings._id
  }

  public deleteUserSettings = async (userId: TObjectId, session?: ClientSession): Promise<void> => {
    const query: TQueryable<IUserSettings> = { userId }
    await this.userSettingsModel.deleteOne(query, { session })
  }
}
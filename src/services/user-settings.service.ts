import { BaseService } from './base.service'
import { ModifyUserSettingsDTO } from '../dtos'
import { DTOHelper } from '../helpers'
import { IIds, IUserSettings } from '../interfaces'
import { TResult, TObjectId } from '../shared/types'
import { UserSettingsRepository } from '../repositories'

export class UserSettingsService extends BaseService {
  constructor(  
    private readonly userSettingsRepository: UserSettingsRepository,
    private readonly dtoHelper: DTOHelper
  ) {
    super()
  }

  public getSettings = async (userId: TObjectId): Promise<TResult<IUserSettings>> => {
    try {

      const userSettings = await this.userSettingsRepository.findUserSettings(userId)

      return this.successResult(userSettings)

    } catch (error: any) {

      return this.errorResult(error)

    }
  }

  public modifySettings = async (userId: TObjectId, modifyUserSettingsDTO: ModifyUserSettingsDTO): Promise<TResult<IIds>> => {
    const processedModifyUserSettingsDTO = this.dtoHelper.processedQuery(modifyUserSettingsDTO)

    try {

      const userSettingsId = await this.userSettingsRepository.modifyUserSettings(userId, processedModifyUserSettingsDTO)

      this.setId('userSettingsId', userSettingsId)

      return this.successResult(this.getIds())

    } catch (error: any) {

      return this.errorResult(error)

    } finally {

      this.clearIds()

    }
  }
}
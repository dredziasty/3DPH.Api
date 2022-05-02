import { FilamentRepository, OrderRepository, ProjectRepository, RollRepository, UserRepository, UserSettingsRepository } from '../repositories'
import { AWSS3Helper, DTOHelper } from '../helpers'
import { TResult, TObjectId } from '../shared/types'
import { IUser, IIds } from '../interfaces'
import { ModifyUserDTO } from '../dtos'
import { EHttpStatus } from '../shared/enums'
import { BaseService } from './base.service'
import { startSession } from 'mongoose'

export class UserService extends BaseService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly userSettingsRepository: UserSettingsRepository,
    private readonly filamentRepository: FilamentRepository,
    private readonly rollRepository: RollRepository,
    private readonly orderRepository: OrderRepository,
    private readonly projectRepository: ProjectRepository,
    private readonly awsS3Helper: AWSS3Helper,
    private readonly dtoHelper: DTOHelper
  ) {
    super()
  }

  public getUser = async (_id: TObjectId): Promise<TResult<IUser>> => {
    try {

      const user = await this.userRepository.findUserById(_id)
      return this.successResult(user)

    } catch (error: any) {

      return this.errorResult(error)

    }
  }

  public modifyUser = async (_id: TObjectId, modifyUserDTO: ModifyUserDTO): Promise<TResult<IIds>> => {
    const filteredModifyUserDTO = this.dtoHelper.removeEmptyFields(modifyUserDTO)

    try {

      const userId = await this.userRepository.modifyUser(_id, filteredModifyUserDTO)

      this.setId('userId', userId)

      return this.successResult(this.getIds())

    } catch (error: any) {

      return this.errorResult(error)

    } finally {

      this.clearIds()

    }
  }

  public deleteUser = async (userId: TObjectId): Promise<TResult<boolean>> => {
    const session = await startSession()
    session.startTransaction()

    try {

      await this.userRepository.deleteUser(userId, session)
      await this.userSettingsRepository.deleteUserSettings(userId, session)
      await this.filamentRepository.deleteFilaments(userId, session)
      await this.rollRepository.hardDeleteRollOrRolls(null, userId, null, session)
      await this.orderRepository.deleteOrders(userId, session)
      await this.projectRepository.deleteProjects(userId, session)
      await this.awsS3Helper.deleteDir(<string>userId)

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
import { BaseService } from './base.service'
import { startSession } from 'mongoose'
import { IIds, IOrder, IUserSettings } from '../interfaces'
import { TResult, TObjectId, TDeleteType, DeepPartial } from '../shared/types'
import { HttpException } from '../shared/exceptions'
import { CreateOrderDTO, ModifyOrderDTO } from '../dtos'
import { EDeleteType, EHttpStatus } from '../shared/enums'
import { DTOHelper } from '../helpers'
import { OrderRepository, UserSettingsRepository } from '../repositories'

export class OrderService extends BaseService {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly userSettingsRepository: UserSettingsRepository,
    private readonly dtoHelper: DTOHelper,
  ) {
    super()
  }

  public getOrders = async (userId: TObjectId): Promise<TResult<IOrder[]>> => {
    try {

      const orders = await this.orderRepository.findOrders(userId)

      return this.successResult(orders)

    } catch (error: any) {

      return this.errorResult(error)

    }
  }

  public getOrder = async (_id: TObjectId, userId: TObjectId): Promise<TResult<IOrder>> => {
    try {

      const order = await this.orderRepository.findOrder(_id, userId)

      return this.successResult(order)

    } catch (error: any) {

      return this.errorResult(error)

    }
  }

  public createOrder = async (userId: TObjectId, createOrderDTO: CreateOrderDTO): Promise<TResult<IIds>> => {
    const session = await startSession()
    session.startTransaction()

    try {

      const generatedCreateOrderDTO = this.dtoHelper.generateQueryFromDTO(createOrderDTO)

      const today = new Date()
      today.setHours(0, 0, 0, 0)

      const plannedCompletionAt = new Date(createOrderDTO.plannedCompletionAt)
      plannedCompletionAt.setHours(0, 0, 0, 0)

      if (plannedCompletionAt < today) {
        throw new HttpException(EHttpStatus.BAD_REQUEST, 'Date of plannedCompletionAt must be greater or equal than today.', ['plannedCompletionAt'])
      }

      const userSettings = await this.userSettingsRepository.findUserSettings(userId, session)

      const number = userSettings.ordersSettings.numbering + 1

      const value = createOrderDTO.items.reduce((prev, curr) => {
        return prev += (curr.amount * curr.price)
      }, 0)

      const orderData: Partial<IOrder> = {
        userId,
        number,
        value,
        ...generatedCreateOrderDTO
      }

      const orderId = await this.orderRepository.createOrder(orderData, session)

      const userSettingsData: DeepPartial<IUserSettings> = {
        ordersSettings: {
          numbering: number
        }
      }
      const processedUserSettingsData = this.dtoHelper.processedQuery(userSettingsData)

      await this.userSettingsRepository.modifyUserSettings(userId, processedUserSettingsData)

      this.setId('orderId', orderId)

      await session.commitTransaction()
      return this.successResult(this.getIds(), EHttpStatus.CREATED)

    } catch (error: any) {

      await session.abortTransaction()
      return this.errorResult(error)

    } finally {

      this.clearIds()
      session.endSession()

    }
  }

  public modifyOrder = async (_id: TObjectId, userId: TObjectId, modifyOrderDTO: ModifyOrderDTO): Promise<TResult<IIds>> => {
    try {

      const processedModifyOrderDTO = this.dtoHelper.processedQuery(modifyOrderDTO)

      const today = new Date()
      today.setHours(0, 0, 0, 0)

      const plannedCompletionAt = new Date(modifyOrderDTO.plannedCompletionAt ?? '')
      plannedCompletionAt.setHours(0, 0, 0, 0)

      if (plannedCompletionAt && (plannedCompletionAt < today)) {
        throw new HttpException(EHttpStatus.BAD_REQUEST, 'Date of plannedCompletionAt must be greater or equal than today.', ['plannedCompletionAt'])
      }

      const order = await this.orderRepository.findOrder(_id, userId)

      if (order.archivisedAt) {
        throw new HttpException(EHttpStatus.BAD_REQUEST, `Cannot modify archivised order`, ['archivisedAt'])
      }

      if (order.completedAt) {
        throw new HttpException(EHttpStatus.BAD_REQUEST, `Cannot modify completed order`, ['completedAt'])
      }

      const value = modifyOrderDTO.items?.reduce((prev, curr) => {
        return prev += (curr.amount * curr.price)
      }, 0) || order.value


      const orderData: Partial<IOrder> = {
        value,
        ...processedModifyOrderDTO
      }

      const orderId = await this.orderRepository.modifyOrder(_id, userId, orderData)

      this.setId('orderId', orderId)

      return this.successResult(this.getIds())

    } catch (error: any) {

      this.clearIds()
      return this.errorResult(error)

    }
  }

  public completeOrder = async (_id: TObjectId, userId: TObjectId): Promise<TResult<IIds>> => {
    try {

      const order = await this.orderRepository.findOrder(_id, userId)

      if (order.completedAt) {
        throw new HttpException(EHttpStatus.BAD_REQUEST, `Order ${order.name} #${order.number} is completed`, ['completedAt'])
      }



      this.setId('orderId', order._id)

      return this.successResult(this.getIds())

    } catch (error: any) {

      this.clearIds()
      return this.errorResult(error)

    }
  }

  public archiviseOrder = async (_id: TObjectId, userId: TObjectId): Promise<TResult<IIds>> => {
    try {

      const order = await this.orderRepository.findOrder(_id, userId)

      if (!order.completedAt) {
        throw new HttpException(EHttpStatus.BAD_REQUEST, `Cannot archivise not completed order`, ['completedAt'])
      }

      if (order.archivisedAt) {
        throw new HttpException(EHttpStatus.BAD_REQUEST, `Order ${order.name} #${order.number} is archivised`, ['archivisedAt'])
      }

      const orderData: Partial<IOrder> = {
        archivisedAt: new Date().toDateString()
      }
      const orderId = await this.orderRepository.modifyOrder(_id, userId, orderData)

      this.setId('orderId', orderId)

      return this.successResult(this.getIds())

    } catch (error: any) {

      this.clearIds()
      return this.errorResult(error)

    }
  }

  public deleteOrder = async (_id: TObjectId, userId: TObjectId, deleteType: TDeleteType): Promise<TResult<boolean>> => {
    try {

      switch (deleteType) {
        case EDeleteType.SOFT:
          await this.orderRepository.softDeleteOrder(_id, userId)
          break

        case EDeleteType.HARD:
          await this.orderRepository.hardDeleteOrder(_id, userId)
          break

        default:
          throw new HttpException(EHttpStatus.BAD_REQUEST, 'Missing type of delete')
      }

      return this.successResult(true, EHttpStatus.NO_CONTENT)

    } catch (error: any) {

      return this.errorResult(error)

    }
  }
}
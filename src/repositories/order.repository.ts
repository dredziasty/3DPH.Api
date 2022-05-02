import { ClientSession } from "mongoose";
import { IOrder } from "../interfaces";
import { NotFoundException, ObjectIsDeletedException } from "../shared/exceptions";
import { TExtendedModel, TObjectId, TQueryable } from "../shared/types";

export class OrderRepository {
  constructor(
    private readonly orderModel: TExtendedModel<IOrder>
  ) { }

  public findOrders = async (userId: TObjectId, session?: ClientSession): Promise<IOrder[]> => {
    const query: TQueryable<IOrder> = { userId, isDeleted: false }
    const orders = await this.orderModel.find(query, null, { session })

    if (!orders)
      throw new NotFoundException('Orders')

    return orders
  }

  public findOrder = async (_id: TObjectId, userId: TObjectId, session?: ClientSession): Promise<IOrder> => {
    const query: TQueryable<IOrder> = { _id, userId, isDeleted: false }
    const order = await this.orderModel.findOne(query, null, { session })

    if (!order)
      throw new NotFoundException('Order', ['_id'])

    return order
  }

  public createOrder = async (orderData: Partial<IOrder>, session?: ClientSession): Promise<TObjectId> => {
    const order = new this.orderModel({
      ...orderData
    })

    await order.save({ session })

    return order._id
  }

  public modifyOrder = async (_id: TObjectId, userId: TObjectId, orderData: Partial<IOrder>, session?: ClientSession): Promise<TObjectId> => {
    const query: TQueryable<IOrder> = { _id, userId, isDeleted: false }
    const order = await this.orderModel.findOneAndUpdate(query, {
      $set: {
        ...orderData
      }
    }, { session })

    if (!order)
      throw new NotFoundException('Order', ['_id'])

    return order._id
  }

  public softDeleteOrder = async (_id: TObjectId, userId: TObjectId, session?: ClientSession): Promise<void> => {
    const query: TQueryable<IOrder> = { _id, userId }
    const order = await this.orderModel.findOne(query, null, { session })

    if (!order)
      throw new NotFoundException('Order', ['_id'])
    if (order.isDeleted)
      throw new ObjectIsDeletedException()

    await order.updateOne({
      $set: { isDeleted: true }
    }, { session })
  }

  public hardDeleteOrder = async (_id: TObjectId, userId: TObjectId, session?: ClientSession): Promise<void> => {
    const query: TQueryable<IOrder> = { _id, userId }
    await this.orderModel.deleteOne(query, { session })
  }

  public deleteOrders = async (userId: TObjectId, session?: ClientSession): Promise<void> => {
    const query: TQueryable<IOrder> = { userId }
    await this.orderModel.deleteMany(query, { session })
  }
}
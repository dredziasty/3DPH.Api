import { BaseController } from './base.controller';
import { Router, Request, Response, NextFunction } from 'express';
import { OrderService } from '../services'
import { EResponseType, EHeaderKey } from '../shared/enums';
import { verifyTokenMiddleware, validationDTOMiddleware, validationParamsMiddleware, methodNotAllowedMiddleware } from '../middlewares';
import { CreateOrderDTO, ModifyOrderDTO } from '../dtos';
import { TDeleteType } from '../shared/types'

export class OrderController extends BaseController {
  public path = '/orders'
  public router = Router({ strict: true })

  constructor(
    private readonly orderService: OrderService
  ) {
    super()
    this.initializeRoutes()
  }

  private initializeRoutes(): void {
    this.router
      .route(this.path)
      .get(
        verifyTokenMiddleware(EHeaderKey.AUTHORIZATION),
        this.catchAsync(this.getAllOrders)
      )
      .post(
        verifyTokenMiddleware(EHeaderKey.AUTHORIZATION),
        validationDTOMiddleware(CreateOrderDTO),
        this.catchAsync(this.createOrder)
      )
      .all(methodNotAllowedMiddleware)

    this.router
      .route(`${this.path}/:orderId`)
      .get(
        verifyTokenMiddleware(EHeaderKey.AUTHORIZATION),
        validationParamsMiddleware('orderId'),
        this.catchAsync(this.getOrderById)
      )
      .patch(
        verifyTokenMiddleware(EHeaderKey.AUTHORIZATION),
        validationParamsMiddleware('orderId'),
        validationDTOMiddleware(ModifyOrderDTO),
        this.catchAsync(this.modifyOrder)
      )
      .all(methodNotAllowedMiddleware)

    this.router
      .route(`${this.path}/:orderId/type/:deleteType`)
      .delete(
        verifyTokenMiddleware(EHeaderKey.AUTHORIZATION),
        validationParamsMiddleware('orderId', 'deleteType'),
        this.catchAsync(this.deleteOrder)
      )
      .all(methodNotAllowedMiddleware)

    this.router
      .route(`${this.path}/:orderId/complete`)
      .patch(
        verifyTokenMiddleware(EHeaderKey.AUTHORIZATION),
        validationParamsMiddleware('orderId'),
        this.catchAsync(this.completeOrder)
      )
      .all(methodNotAllowedMiddleware)

    this.router
      .route(`${this.path}/:orderId/archive`)
      .patch(
        verifyTokenMiddleware(EHeaderKey.AUTHORIZATION),
        validationParamsMiddleware('orderId'),
        this.catchAsync(this.archiviseOrder)
      )
      .all(methodNotAllowedMiddleware)
  }

  private getAllOrders = async (req: Request, res: Response, next: NextFunction) => {
    const userId = this.getIdFromHeader(req.headers)

    const result = await this.orderService.getOrders(userId)

    this.sendResponse(EResponseType.JSON, result, res, next)
  }

  private getOrderById = async (req: Request, res: Response, next: NextFunction) => {
    const userId = this.getIdFromHeader(req.headers)
    const { orderId } = req.params

    const result = await this.orderService.getOrder(orderId, userId)

    this.sendResponse(EResponseType.JSON, result, res, next)
  }

  private createOrder = async (req: Request, res: Response, next: NextFunction) => {
    const userId = this.getIdFromHeader(req.headers)
    const createOrderDTO: CreateOrderDTO = req.body

    const result = await this.orderService.createOrder(userId, createOrderDTO)

    this.sendResponse(EResponseType.JSON, result, res, next)
  }

  private modifyOrder = async (req: Request, res: Response, next: NextFunction) => {
    const userId = this.getIdFromHeader(req.headers)
    const { orderId } = req.params
    const modifyOrderDTO: ModifyOrderDTO = req.body

    const result = await this.orderService.modifyOrder(orderId, userId, modifyOrderDTO)

    this.sendResponse(EResponseType.JSON, result, res, next)
  }

  private completeOrder = async (req: Request, res: Response, next: NextFunction) => {
    const userId = this.getIdFromHeader(req.headers)
    const { orderId } = req.params

    const result = await this.orderService.completeOrder(orderId, userId)

    this.sendResponse(EResponseType.JSON, result, res, next)
  }

  private archiviseOrder = async (req: Request, res: Response, next: NextFunction) => {
    const userId = this.getIdFromHeader(req.headers)
    const { orderId } = req.params

    const result = await this.orderService.archiviseOrder(orderId, userId)

    this.sendResponse(EResponseType.JSON, result, res, next)
  }

  private deleteOrder = async (req: Request, res: Response, next: NextFunction) => {
    const userId = this.getIdFromHeader(req.headers)
    const { orderId, deleteType } = req.params

    const result = await this.orderService.deleteOrder(orderId, userId, <TDeleteType>deleteType)

    this.sendResponse(EResponseType.NO_JSON, result, res, next)
  }
}
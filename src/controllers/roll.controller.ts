import { BaseController } from './base.controller';
import { Router, Request, Response, NextFunction } from 'express';
import { ChangeWeightDTO, CreateRollDTO, ModifyRollDTO } from '../dtos'
import { verifyTokenMiddleware, validationDTOMiddleware, validationParamsMiddleware, methodNotAllowedMiddleware } from '../middlewares'
import { RollService } from '../services'
import { EResponseType, EHeaderKey } from '../shared/enums';
import { TDeleteType } from '../shared/types';

export class RollController extends BaseController {
  public path = '/rolls'
  public router = Router({ strict: true })

  constructor(
    private readonly rollService: RollService
  ) {
    super()
    this.initializeRoutes()
  }

  private initializeRoutes(): void {
    this.router
      .route(this.path)
      .post(
        verifyTokenMiddleware(EHeaderKey.AUTHORIZATION),
        validationDTOMiddleware(CreateRollDTO),
        this.catchAsync(this.createRoll)
      )
      .all(methodNotAllowedMiddleware)

    this.router
      .route(`${this.path}/filament/:filamentId`)
      .get(
        verifyTokenMiddleware(EHeaderKey.AUTHORIZATION),
        validationParamsMiddleware('filamentId'),
        this.catchAsync(this.getAllRolls)
      )

    this.router
      .route(`${this.path}/:rollId`)
      .get(
        verifyTokenMiddleware(EHeaderKey.AUTHORIZATION),
        validationParamsMiddleware('rollId'),
        this.catchAsync(this.getRollById)
      )
      .patch(
        verifyTokenMiddleware(EHeaderKey.AUTHORIZATION),
        validationParamsMiddleware('rollId'),
        validationDTOMiddleware(ModifyRollDTO),
        this.catchAsync(this.modifyRoll)
      )
      .all(methodNotAllowedMiddleware)

    this.router
      .route(`${this.path}/:rollId/type/:deleteType`)
      .delete(
        verifyTokenMiddleware(EHeaderKey.AUTHORIZATION),
        validationParamsMiddleware('rollId'),
        this.catchAsync(this.deleteRoll)
      )
      .all(methodNotAllowedMiddleware)

    this.router
      .route(`${this.path}/:rollId/archive`)
      .patch(
        verifyTokenMiddleware(EHeaderKey.AUTHORIZATION),
        validationParamsMiddleware('rollId'),
        this.catchAsync(this.archiviseRoll)
      )
      .all(methodNotAllowedMiddleware)

    this.router
      .route(`${this.path}/:rollId/weight`)
      .patch(
        verifyTokenMiddleware(EHeaderKey.AUTHORIZATION),
        validationParamsMiddleware('rollId'),
        validationDTOMiddleware(ChangeWeightDTO),
        this.catchAsync(this.calculateWeight)
      )
      .all(methodNotAllowedMiddleware)
  }

  private getAllRolls = async (req: Request, res: Response, next: NextFunction) => {
    const userId = this.getIdFromHeader(req.headers)
    const { filamentId } = req.body

    const result = await this.rollService.getRollsByFilamentId(userId, filamentId)

    this.sendResponse(EResponseType.JSON, result, res, next)
  }

  private getRollById = async (req: Request, res: Response, next: NextFunction) => {
    const userId = this.getIdFromHeader(req.headers)
    const { rollId } = req.params

    const result = await this.rollService.getRollById(rollId, userId)

    this.sendResponse(EResponseType.JSON, result, res, next)
  }

  private createRoll = async (req: Request, res: Response, next: NextFunction) => {
    const userId = this.getIdFromHeader(req.headers)
    const createRollDTO: CreateRollDTO = req.body

    const result = await this.rollService.createRoll(userId, createRollDTO)

    this.sendResponse(EResponseType.JSON, result, res, next)
  }

  private modifyRoll = async (req: Request, res: Response, next: NextFunction) => {
    const userId = this.getIdFromHeader(req.headers)
    const modifyRollDTO: ModifyRollDTO = req.body
    const { rollId } = req.params

    const result = await this.rollService.modifyRoll(rollId, userId, modifyRollDTO)

    this.sendResponse(EResponseType.JSON, result, res, next)
  }

  private archiviseRoll = async (req: Request, res: Response, next: NextFunction) => {
    const userId = this.getIdFromHeader(req.headers)
    const { rollId } = req.params

    const result = await this.rollService.archiviseRoll(rollId, userId)

    this.sendResponse(EResponseType.JSON, result, res, next)
  }

  private deleteRoll = async (req: Request, res: Response, next: NextFunction) => {
    const userId = this.getIdFromHeader(req.headers)
    const { rollId, deleteType } = req.params

    const result = await this.rollService.deleteRoll(rollId, userId, <TDeleteType>deleteType)

    this.sendResponse(EResponseType.NO_JSON, result, res, next)
  }

  private calculateWeight = async (req: Request, res: Response, next: NextFunction) => {
    const userId = this.getIdFromHeader(req.headers)
    const changeWeightDTO: ChangeWeightDTO = req.body
    const { rollId } = req.params

    const result = await this.rollService.calculateWeight(rollId, userId, changeWeightDTO)

    this.sendResponse(EResponseType.JSON, result, res, next)
  }
}
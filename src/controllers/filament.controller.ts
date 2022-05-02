import { BaseController } from "./base.controller";
import { FilamentService } from "../services";
import { NextFunction, Request, Response, Router } from "express";
import { methodNotAllowedMiddleware, validationDTOMiddleware, validationParamsMiddleware, verifyTokenMiddleware } from "../middlewares";
import { EHeaderKey, EResponseType } from "../shared/enums";
import { CreateFilamentDTO, ModifyFilamentDTO } from "../dtos";
import { TDeleteType } from "../shared/types";

export class FilamentController extends BaseController {
  public path = '/filaments'
  public router = Router({ strict: true })

  constructor(
    private readonly filamentService: FilamentService
  ) {
    super()
    this.initializeRoutes()
  }

  private initializeRoutes(): void {
    this.router
      .route(this.path)
      .get(
        verifyTokenMiddleware(EHeaderKey.AUTHORIZATION),
        this.catchAsync(this.getFilaments)
      )
      .post(
        verifyTokenMiddleware(EHeaderKey.AUTHORIZATION),
        validationDTOMiddleware(CreateFilamentDTO),
        this.catchAsync(this.createFilament)
      )
      .all(methodNotAllowedMiddleware)

    this.router
      .route(`${this.path}/:filamentId`)
      .get(
        verifyTokenMiddleware(EHeaderKey.AUTHORIZATION),
        validationParamsMiddleware('filamentId'),
        this.catchAsync(this.getFilament)
      )
      .patch(
        verifyTokenMiddleware(EHeaderKey.AUTHORIZATION),
        validationParamsMiddleware('filamentId'),
        validationDTOMiddleware(ModifyFilamentDTO),
        this.catchAsync(this.modifyFilament)
      )
      .all(methodNotAllowedMiddleware)

    this.router
      .route(`${this.path}/:filamentId/type/:deleteType`)
      .delete(
        verifyTokenMiddleware(EHeaderKey.AUTHORIZATION),
        validationParamsMiddleware('filamentId'),
        this.catchAsync(this.deleteFilament)
      )
  }

  private getFilaments = async (req: Request, res: Response, next: NextFunction) => {
    const userId = this.getIdFromHeader(req.headers)

    const result = await this.filamentService.getFilaments(userId)

    this.sendResponse(EResponseType.JSON, result, res, next)
  }

  private getFilament = async (req: Request, res: Response, next: NextFunction) => {
    const userId = this.getIdFromHeader(req.headers)
    const { filamentId } = req.body

    const result = await this.filamentService.getFilament(userId, filamentId)

    this.sendResponse(EResponseType.JSON, result, res, next)
  }

  private createFilament = async (req: Request, res: Response, next: NextFunction) => {
    const userId = this.getIdFromHeader(req.headers)
    const createFilamentDTO: CreateFilamentDTO = req.body

    const result = await this.filamentService.createFilament(userId, createFilamentDTO)

    this.sendResponse(EResponseType.JSON, result, res, next)
  }

  private modifyFilament = async (req: Request, res: Response, next: NextFunction) => {
    const userId = this.getIdFromHeader(req.headers)
    const { filamentId } = req.params
    const modifyFilamentDTO: ModifyFilamentDTO = req.body

    const result = await this.filamentService.modifyFilament(filamentId, userId, modifyFilamentDTO)

    this.sendResponse(EResponseType.JSON, result, res, next)
  }

  private deleteFilament = async (req: Request, res: Response, next: NextFunction) => {
    const userId = this.getIdFromHeader(req.headers)
    const { filamentId, deleteType } = req.params

    const result = await this.filamentService.deleteFilament(filamentId, userId, <TDeleteType>deleteType)

    this.sendResponse(EResponseType.NO_JSON, result, res, next)
  }
}
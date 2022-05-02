import { BaseController } from './base.controller';
import { Request, Response, NextFunction } from 'express'
import { Router } from 'express'
import { UserSettingsService } from '../services'
import { methodNotAllowedMiddleware, verifyTokenMiddleware, validationDTOMiddleware } from '../middlewares'
import { ModifyUserSettingsDTO } from '../dtos'
import { EResponseType, EHeaderKey } from '../shared/enums'

export class UserSettingsController extends BaseController {
  public path = '/users-settings'
  public router = Router({ strict: true })

  constructor(
    private readonly userSettingsService: UserSettingsService
  ) {
    super()
    this.initializeRoutes()
  }

  private initializeRoutes(): void {
    this.router
      .route(this.path)
      .get(
        verifyTokenMiddleware(EHeaderKey.AUTHORIZATION),
        this.catchAsync(this.getUserSettings)
      ).patch(
        verifyTokenMiddleware(EHeaderKey.AUTHORIZATION),
        validationDTOMiddleware(ModifyUserSettingsDTO),
        this.catchAsync(this.modifyUserSettings)
      )
      .all(methodNotAllowedMiddleware)
  }

  private getUserSettings = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const userId = this.getIdFromHeader(req.headers)

    const result = await this.userSettingsService.getSettings(userId)

    this.sendResponse(EResponseType.JSON, result, res, next)
  }

  private modifyUserSettings = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const userId = this.getIdFromHeader(req.headers)
    const modifyUserSettingsDTO: ModifyUserSettingsDTO = req.body

    const result = await this.userSettingsService.modifySettings(userId, modifyUserSettingsDTO)

    this.sendResponse(EResponseType.JSON, result, res, next)
  }
}
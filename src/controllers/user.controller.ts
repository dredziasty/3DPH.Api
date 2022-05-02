import { BaseController } from './base.controller';
import { Router, Request, Response, NextFunction } from 'express'
import { ModifyUserDTO } from '../dtos'
import { verifyTokenMiddleware, validationDTOMiddleware, methodNotAllowedMiddleware } from '../middlewares'
import { UserService } from '../services'
import { EResponseType, EHeaderKey } from '../shared/enums'

export class UserController extends BaseController {
  public path = '/users'
  public router = Router({ strict: true })

  constructor(
    private readonly userService: UserService
  ) {
    super()
    this.initializeRoutes()
  }

  private initializeRoutes(): void {
    this.router
      .route(`${this.path}/me`)
      .get(
        verifyTokenMiddleware(EHeaderKey.AUTHORIZATION),
        this.catchAsync(this.getUserById)
      )
      .patch(
        verifyTokenMiddleware(EHeaderKey.AUTHORIZATION),
        validationDTOMiddleware(ModifyUserDTO),
        this.catchAsync(this.modifyUser)
      )
      .delete(
        verifyTokenMiddleware(EHeaderKey.AUTHORIZATION),
        this.catchAsync(this.deleteUser)
      )
      .all(methodNotAllowedMiddleware)

    this.router.all(
      this.path,
      methodNotAllowedMiddleware
    )
  }

  private getUserById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const userId = this.getIdFromHeader(req.headers)

    const result = await this.userService.getUser(userId)

    this.sendResponse(EResponseType.JSON, result, res, next)
  }

  private modifyUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const userId = this.getIdFromHeader(req.headers)
    const modifyUserDTO: ModifyUserDTO = req.body

    const result = await this.userService.modifyUser(userId, modifyUserDTO)

    this.sendResponse(EResponseType.JSON, result, res, next)
  }

  private deleteUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const userId = this.getIdFromHeader(req.headers)

    const result = await this.userService.deleteUser(userId)

    this.sendResponse(EResponseType.NO_JSON, result, res, next)
  }
}
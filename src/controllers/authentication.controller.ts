import { BaseController } from './base.controller';
import { Router, Request, Response, NextFunction } from 'express'
import { CreateUserDTO, LoginDTO, ChangePasswordDTO, ConfirmPasswordDTO, RestorePasswordDTO } from '../dtos'
import { verifyTokenMiddleware, validationDTOMiddleware } from '../middlewares'
import { AuthenticationService } from '../services'
import { EHeaderKey, EResponseType } from '../shared/enums'
import { methodNotAllowedMiddleware } from '../middlewares'

export class AuthenticationController extends BaseController {
  public path = '/auth'
  public router = Router({ strict: true })

  constructor(
    private readonly authenticationService: AuthenticationService
  ) {
    super()
    this.initializeRoutes()
  }

  private initializeRoutes(): void {
    this.router
      .route(`${this.path}/register`)
      .post(
        validationDTOMiddleware(CreateUserDTO),
        this.catchAsync(this.register)
      )
      .all(methodNotAllowedMiddleware)

    this.router
      .route(`${this.path}/login`)
      .post(
        validationDTOMiddleware(LoginDTO),
        this.catchAsync(this.login)
      )
      .all(methodNotAllowedMiddleware)

    this.router
      .route(`${this.path}/logout`)
      .post(
        verifyTokenMiddleware(EHeaderKey.REFRESH_TOKEN),
        this.catchAsync(this.logout)
      )
      .all(methodNotAllowedMiddleware)

    this.router
      .route(`${this.path}/token/renew`)
      .post(
        verifyTokenMiddleware(EHeaderKey.REFRESH_TOKEN),
        this.catchAsync(this.renewToken)
      )
      .all(methodNotAllowedMiddleware)

    this.router
      .route(`${this.path}/password`)
      .post(
        verifyTokenMiddleware(EHeaderKey.AUTHORIZATION),
        validationDTOMiddleware(ChangePasswordDTO),
        this.catchAsync(this.changePassword)
      )
      .all(methodNotAllowedMiddleware)

    this.router
      .route(`${this.path}/password/restore`)
      .post(
        methodNotAllowedMiddleware,
        validationDTOMiddleware(RestorePasswordDTO),
        this.catchAsync(this.resetPassword)
      )
      .all(methodNotAllowedMiddleware)

    this.router
      .route(`${this.path}/password/confirm`)
      .post(
        verifyTokenMiddleware(EHeaderKey.AUTHORIZATION),
        validationDTOMiddleware(ConfirmPasswordDTO),
        this.catchAsync(this.confirmPassword)
      )
      .all(methodNotAllowedMiddleware)

    this.router.all(
      this.path,
      methodNotAllowedMiddleware
    )
  }

  private register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const createUserDTO: CreateUserDTO = req.body

    const result = await this.authenticationService.registerUser(createUserDTO)

    this.sendResponse(EResponseType.NO_JSON, result, res, next)
  }

  private login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const loginDTO: LoginDTO = req.body

    const result = await this.authenticationService.loginUser(loginDTO)

    this.sendResponse(EResponseType.AUTH, result, res, next)
  }

  private logout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const userId = this.getIdFromHeader(req.headers, EHeaderKey.REFRESH_TOKEN)
    const bearerRefreshToken: string = <string>req.headers[EHeaderKey.REFRESH_TOKEN.toLowerCase()]

    const result = await this.authenticationService.logoutUser(userId, bearerRefreshToken)

    this.sendResponse(EResponseType.NO_JSON, result, res, next)
  }

  private renewToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const userId = this.getIdFromHeader(req.headers, EHeaderKey.REFRESH_TOKEN)
    const bearerRefreshToken: string = <string>req.headers[EHeaderKey.REFRESH_TOKEN.toLowerCase()]

    const result = await this.authenticationService.renewUserToken(userId, bearerRefreshToken)

    this.sendResponse(EResponseType.AUTH, result, res, next)
  }

  private resetPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    // Implementacja wymaga wykupienia domeny.
  }

  private changePassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const userId = this.getIdFromHeader(req.headers)
    const changePasswordDTO: ChangePasswordDTO = req.body

    const result = await this.authenticationService.changeUserPassword(userId, changePasswordDTO)

    this.sendResponse(EResponseType.NO_JSON, result, res, next)
  }

  private confirmPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const userId = this.getIdFromHeader(req.headers)
    const confirmPasswordDTO: ConfirmPasswordDTO = req.body

    const result = await this.authenticationService.confirmPassword(userId, confirmPasswordDTO)

    this.sendResponse(EResponseType.NO_JSON, result, res, next)
  }
}
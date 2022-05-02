import { BaseController } from './base.controller';
import { Router, Request, Response, NextFunction } from 'express'
import multer from 'multer'
import { ProjectService } from '../services'
import { UploadFileDTO, CreateProjectDTO } from '../dtos'
import { verifyTokenMiddleware, validationDTOMiddleware, validationParamsMiddleware, verifyUploadedFileMiddleware, methodNotAllowedMiddleware } from '../middlewares'
import * as config from '../config'
import { EResponseType, EHeaderKey } from '../shared/enums'

export class ProjectController extends BaseController {
  public path = '/projects'
  public router = Router({ strict: true })
  private upload = multer()

  constructor(
    private readonly projectService: ProjectService
  ) {
    super()
    this.initializeRoutes()
  }

  private initializeRoutes(): void {
    this.router
      .route(this.path)
      .get(
        verifyTokenMiddleware(EHeaderKey.AUTHORIZATION),
        this.catchAsync(this.getProjects)
      )
      .post(
        verifyTokenMiddleware(EHeaderKey.AUTHORIZATION),
        validationDTOMiddleware(CreateProjectDTO),
        this.catchAsync(this.createProject)
      )
      .all(methodNotAllowedMiddleware)

    this.router
      .route(`${this.path}/:projectId`)
      .get(
        verifyTokenMiddleware(EHeaderKey.AUTHORIZATION),
        validationParamsMiddleware('projectId'),
        this.catchAsync(this.getProject)
      )
      .delete(
        verifyTokenMiddleware(EHeaderKey.AUTHORIZATION),
        validationParamsMiddleware('projectId'),
        this.catchAsync(this.deleteProject)
      )
      .all(methodNotAllowedMiddleware)

    this.router
      .route(`${this.path}/:projectId/files`,)
      .post(
        verifyTokenMiddleware(EHeaderKey.AUTHORIZATION),
        this.upload.single('projectFile'),
        validationParamsMiddleware('projectId'),
        validationDTOMiddleware(UploadFileDTO),
        verifyUploadedFileMiddleware('projectFile', config.PROJECT_EXTENSIONS),
        this.catchAsync(this.uploadFileToProject)
      )
      .all(methodNotAllowedMiddleware)

    this.router
      .route(`${this.path}/:projectId/files/:fileId`)
      .get(
        verifyTokenMiddleware(EHeaderKey.AUTHORIZATION),
        validationParamsMiddleware('projectId', 'fileId'),
        this.catchAsync(this.downloadFileFromProject)
      )
      .delete(
        verifyTokenMiddleware(EHeaderKey.AUTHORIZATION),
        validationParamsMiddleware('projectId', 'fileId'),
        this.catchAsync(this.deleteFileFromProject)
      )
      .all(methodNotAllowedMiddleware)
  }

  private getProjects = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const userId = this.getIdFromHeader(req.headers)

    const result = await this.projectService.getProjects(userId)

    this.sendResponse(EResponseType.JSON, result, res, next)
  }

  private getProject = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const userId = this.getIdFromHeader(req.headers)
    const { projectId } = req.params

    const result = await this.projectService.getProject(projectId, userId)

    this.sendResponse(EResponseType.JSON, result, res, next)
  }

  private createProject = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const userId = this.getIdFromHeader(req.headers)
    const createProjectDTO: CreateProjectDTO = req.body

    const result = await this.projectService.createProject(userId, createProjectDTO)

    this.sendResponse(EResponseType.JSON, result, res, next)
  }

  private uploadFileToProject = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const userId = this.getIdFromHeader(req.headers)
    const { projectId } = req.params
    const uploadFileDTO: UploadFileDTO = req.body
    const fileContent: Buffer = <Buffer>req.file?.buffer

    const result = await this.projectService.uploadFile(projectId, userId, uploadFileDTO, fileContent)

    this.sendResponse(EResponseType.JSON, result, res, next)
  }

  private downloadFileFromProject = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const userId = this.getIdFromHeader(req.headers)
    const { projectId, fileId } = req.params

    const result = await this.projectService.downloadFile(projectId, fileId, userId)

    this.sendResponse(EResponseType.DOWNLOAD, result, res, next)
  }

  private deleteProject = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const userId = this.getIdFromHeader(req.headers)
    const { projectId } = req.params

    const result = await this.projectService.deleteProject(projectId, userId)

    this.sendResponse(EResponseType.NO_JSON, result, res, next)
  }

  private deleteFileFromProject = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const userId = this.getIdFromHeader(req.headers)
    const { projectId, fileId } = req.params

    const result = await this.projectService.deleteFile(projectId, fileId, userId)

    this.sendResponse(EResponseType.NO_JSON, result, res, next)
  }

}
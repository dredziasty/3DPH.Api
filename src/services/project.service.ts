import { BaseService } from './base.service'
import { TResult, TObjectId } from '../shared/types'
import { IProject, IFile, IIds } from '../interfaces'
import { CreateProjectDTO, UploadFileDTO } from '../dtos'
import { NotFoundException } from '../shared/exceptions'
import { EHttpStatus } from '../shared/enums'
import { startSession } from 'mongoose'
import { AWSS3Helper } from '../helpers'
import { ProjectRepository } from '../repositories'

export class ProjectService extends BaseService {
  constructor(
    private readonly projectRepository: ProjectRepository,
    private readonly awsS3Helper: AWSS3Helper,
  ) {
    super()
  }

  public getProjects = async (userId: TObjectId): Promise<TResult<IProject[]>> => {
    try {

      const projects = await this.projectRepository.findProjects(userId)
      return this.successResult(projects)
      
    } catch (error: any) {

      return this.errorResult(error)

    }
  }

  public getProject = async (_id: TObjectId, userId: TObjectId): Promise<TResult<IProject>> => {
    try {

      const project = await this.projectRepository.findProject(_id, userId)
      return this.successResult(project)

    } catch (error: any) {

      return this.errorResult(error)

    }
  }

  public createProject = async (userId: TObjectId, createProjectDTO: CreateProjectDTO): Promise<TResult<IIds>> => {
    const session = await startSession()
    session.startTransaction()

    try {

      const projectData: Partial<IProject> = { userId, ...createProjectDTO }
      const key = `${this.catalogPrefix(userId)}/${createProjectDTO.name}/`

      const [project] = await Promise.all([
        this.projectRepository.createProject(projectData, session),
        this.awsS3Helper.putObject(key)
      ])

      this.setId('projectId', project._id)
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

  public uploadFile = async (_id: TObjectId, userId: TObjectId, uploadFileDTO: UploadFileDTO, fileContent: Buffer): Promise<TResult<IIds>> => {
    const session = await startSession()
    session.startTransaction()

    try {

      const project = await this.projectRepository.modifyProject(_id, userId, uploadFileDTO)
      const key = `${this.catalogPrefix(project.userId)}/${project.name}/${this.filename(uploadFileDTO as IFile)}`

      await this.awsS3Helper.putObject(key, fileContent)

      const file = project.files.pop()
      if (!file) throw new NotFoundException('File')

      this.setId('fileId', <TObjectId>file._id)

      await session.commitTransaction()
      return this.successResult(this.getIds())

    } catch (error: any) {

      await session.abortTransaction()
      return this.errorResult(error)

    } finally {

      this.clearIds()
      session.endSession()

    }
  }

  public downloadFile = async (_id: TObjectId, fileId: TObjectId, userId: TObjectId): Promise<TResult<IFile>> => {
    try {

      const project = await this.projectRepository.findProject(_id, userId)
      const file = project.files.find((file: IFile) => file?._id == fileId)

      if (!file) throw new NotFoundException('File', ['fileId'])

      const key = `${this.catalogPrefix(project.userId)}/${project.name}/${this.filename(file)}`

      const s3Result = await this.awsS3Helper.getObject(key)

      const _content = s3Result.Body as Buffer
      const fileData = {
        name: file.name,
        extension: file.extension,
        content: Buffer.from(_content)
      } as IFile

      return this.successResult(fileData)

    } catch (error: any) {

      return this.errorResult(error)

    }
  }

  public deleteFile = async (_id: TObjectId, fileId: TObjectId, userId: TObjectId): Promise<TResult<boolean>> => {
    const session = await startSession()
    session.startTransaction()

    try {

      const project = await this.projectRepository.findProject(_id, userId, session)
      const deletedFile = project.files.find((file: IFile) => file?._id == fileId)

      if (!deletedFile)
        throw new NotFoundException('File', ['fileId'])

      const updatedFiles = project.files.filter((file: IFile) => file?._id != fileId)
      const projectData: Partial<IProject> = {
        files: updatedFiles
      }

      await this.projectRepository.modifyProject(_id, userId, projectData, session)

      const key = `${this.catalogPrefix(project.userId)}/${project.name}/${this.filename(deletedFile)}`
      await this.awsS3Helper.deleteObject(key)

      await session.commitTransaction()
      return this.successResult(true, EHttpStatus.NO_CONTENT)

    } catch (error: any) {

      await session.abortTransaction()
      return this.errorResult(error)

    } finally {

      session.endSession()

    }
  }

  public deleteProject = async (_id: TObjectId, userId: TObjectId): Promise<TResult<boolean>> => {
    const session = await startSession()
    session.startTransaction()

    try {

      const project = await this.projectRepository.findProject(_id, userId, session)
      await this.projectRepository.hardDeleteProject(_id, userId, session)

      const key = `${this.catalogPrefix(project.userId)}/${project.name}/`

      await this.awsS3Helper.deleteDir(key)
      await session.commitTransaction()
      return this.successResult(true, EHttpStatus.NO_CONTENT)

    } catch (error: any) {

      await session.abortTransaction()
      return this.errorResult(error)

    } finally {

      session.endSession()

    }
  }

  private catalogPrefix = (userId: TObjectId): string => `${userId}/projects`

  private filename = (file: IFile): string => `${file.name}.${file.extension}`
}
import { ClientSession } from "mongoose";
import { IProject } from "../interfaces";
import { EHttpStatus } from "../shared/enums";
import { HttpException, NotFoundException, ObjectIsDeletedException } from "../shared/exceptions";
import { TExtendedModel, TObjectId, TQueryable } from "../shared/types";

export class ProjectRepository {
  constructor(
    private readonly projectModel: TExtendedModel<IProject>
  ) { }

  public findProjects = async (userId: TObjectId, session?: ClientSession): Promise<IProject[]> => {
    const query: TQueryable<IProject> = { userId, isDeleted: false }
    const projects = await this.projectModel.find(query, null, { session }).lean()

    if (!projects)
      throw new NotFoundException('Projects')

    return projects
  }

  public findProject = async (_id: TObjectId, userId: TObjectId, session?: ClientSession): Promise<IProject> => {
    const query: TQueryable<IProject> = { _id, userId, isDeleted: false }
    const project = await this.projectModel.findOne(query, null, { session }).lean()

    if (!project)
      throw new NotFoundException('Project', ['_id'])

    return project
  }

  public createProject = async (projectData: Partial<IProject>, session?: ClientSession): Promise<IProject> => {
    let project = null
    const query: TQueryable<IProject> = { name: projectData?.name, userId: projectData?.userId }
    project = await this.projectModel.findOne(query, null, { session }).lean()

    if (project)
      throw new HttpException(EHttpStatus.BAD_REQUEST, `Project named ${project.name} already exists.`, ['name'])

    project = new this.projectModel({
      ...projectData
    })

    await project.save({ session })

    return project
  }

  public modifyProject = async (_id: TObjectId, userId: TObjectId, projectData: Partial<IProject>, session?: ClientSession): Promise<IProject> => {
    const query: TQueryable<IProject> = { _id, userId, isDeleted: false }
    const project = await this.projectModel.findOneAndUpdate(query, {
      $set: {
        ...projectData
      }
    }, { session })

    if (!project)
      throw new NotFoundException('Project', ['_id'])

    return project
  }

  public softDeleteProject = async (_id: TObjectId, userId: TObjectId, session?: ClientSession): Promise<void> => {
    const query: TQueryable<IProject> = { _id, userId }
    const project = await this.projectModel.findOne(query, null, { session })

    if (!project)
      throw new NotFoundException('Project', ['_id'])
    if (project.isDeleted)
      throw new ObjectIsDeletedException()

    await project.updateOne({
      $set: { isDeleted: true }
    }, { session })
  }

  public hardDeleteProject = async (_id: TObjectId, userId: TObjectId, session?: ClientSession): Promise<void> => {
    const query: TQueryable<IProject> = { _id, userId }
    await this.projectModel.findByIdAndDelete(query, { session })
  }

  public deleteProjects = async (userId: TObjectId, session?: ClientSession): Promise<void> => {
    const query: TQueryable<IProject> = { userId }
    await this.projectModel.deleteMany(query, { session })
  }
}
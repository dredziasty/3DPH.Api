import { ClientSession } from 'mongoose';
import { IUser } from '../interfaces';
import { EHttpStatus } from '../shared/enums';
import { HttpException, NotFoundException, UserAlreadyExistsException } from '../shared/exceptions';
import { TExtendedModel, TObjectId, TQueryable } from '../shared/types'

export class UserRepository {
  constructor(
    private readonly userModel: TExtendedModel<IUser>,
  ) { }

  public findUserById = async (_id: TObjectId, session?: ClientSession): Promise<IUser> => {
    const user = await this.userModel.findById(_id, '-password', { session }).lean()
    if (!user)
      throw new HttpException(EHttpStatus.BAD_REQUEST, 'Invalid _id in the access token')

    return user
  }

  public findUserByEmail = async (email: string, session?: ClientSession): Promise<IUser> => {
    const user = await this.userModel.findOne({ email }, null, { session }).lean()
    if (!user)
      throw new NotFoundException('User', ['email'])

    return user
  }

  public createUser = async (userData: Partial<IUser>, session?: ClientSession): Promise<TObjectId> => {
    const { username, email } = userData
    const query: TQueryable<IUser> = { username, email }
    let user = await this.userModel.findOne(query, null, { session })

    if (user) {
      const issues: string[] = []

      user.username === username ? issues.push('username') : null
      user.email === email ? issues.push('email') : null

      throw new UserAlreadyExistsException(issues)
    }

    user = new this.userModel({
      ...userData
    })

    await user.save({ session })
    return user._id
  }

  public modifyUser = async (_id: TObjectId, userData: Partial<IUser>, session?: ClientSession): Promise<TObjectId> => {
    const user = await this.userModel.findByIdAndUpdate(
      _id,
      { $set: { ...userData } },
      { session }
    )
    if (!user)
      throw new HttpException(EHttpStatus.BAD_REQUEST, 'Invalid _id in the access token')

    return user._id;
  }

  public deleteUser = async (_id: TObjectId, session?: ClientSession): Promise<void> => {
    const user = await this.userModel.findByIdAndDelete(_id, { session })
    if (!user)
      throw new HttpException(EHttpStatus.BAD_REQUEST, 'Invalid _id in the access token')
  }
}
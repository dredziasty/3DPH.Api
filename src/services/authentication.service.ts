import { BaseService } from '.'
import nodemailer from 'nodemailer'
import * as config from '../config'
import { CreateUserDTO, LoginDTO, RestorePasswordDTO, ChangePasswordDTO, ConfirmPasswordDTO } from '../dtos'
import { ITokenPayload, IBearerTokens, IUser } from '../interfaces'
import { startSession } from 'mongoose'
import { HttpException, NotFoundException } from '../shared/exceptions'
import { EToken, EHttpStatus, EServiceResult } from '../shared/enums'
import { TResult, TObjectId } from '../shared/types'
import { comparePasswords, hashPassword, generateBearerToken } from '../shared/utils'
import { default as redis } from '../redis'
import { UserRepository, UserSettingsRepository } from '../repositories'

export class AuthenticationService extends BaseService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly userSettingsRepository: UserSettingsRepository
  ) {
    super()
  }

  public registerUser = async (createUserDTO: CreateUserDTO): Promise<TResult<boolean>> => {
    const session = await startSession()
    session.startTransaction()

    try {

      const hash = await hashPassword(createUserDTO.password)
      const newCreateUserDTO = {
        ...createUserDTO,
        password: hash
      }

      const userId = await this.userRepository.createUser(newCreateUserDTO, session)
      await this.userSettingsRepository.createUserSettings(userId, session)

      await session.commitTransaction()
      return this.successResult(true, EHttpStatus.CREATED)

    } catch (error: any) {

      await session.abortTransaction()
      return this.errorResult(error)

    } finally {

      session.endSession()

    }
  }

  public loginUser = async (loginDTO: LoginDTO): Promise<TResult<IBearerTokens>> => {
    const { email, password } = loginDTO

    try {

      const user = await this.userRepository.findUserByEmail(email)

      if (!await comparePasswords(password, user)) {
        throw new HttpException(EHttpStatus.BAD_REQUEST, 'Incorrect password', ['password'])
      }

      const payload: ITokenPayload = {
        _id: user._id
      }

      const tokens: IBearerTokens = {
        bearerAccessToken: generateBearerToken(payload, EToken.ACCESS),
        bearerRefreshToken: generateBearerToken(payload, EToken.REFRESH)
      }

      const redisKey = `refresh-token/${user._id}`
      const cachedTokenData = await redis.getAsync(redisKey)
      const fixedToken = this.fixToken(tokens.bearerRefreshToken)
      const newCachedTokenData = cachedTokenData ? [...cachedTokenData.split(';'), fixedToken].join(';') : fixedToken

      await redis.setAsync(redisKey, newCachedTokenData)
      return this.successResult(tokens, EHttpStatus.NO_CONTENT)

    } catch (error: any) {

      return this.errorResult(error)

    }
  }

  public logoutUser = async (userId: TObjectId, userBearerRefreshToken: string): Promise<TResult<boolean>> => {
    try {

      const redisKey = `refresh-token/${userId}`
      const cachedTokenData = await redis.getAsync(redisKey)

      if (!cachedTokenData) {
        throw new HttpException(EHttpStatus.UNAUTHORIZED, `You aren't authorized to use renew token method.`, ['bearerRefreshToken'])
      }

      const cachedTokens = cachedTokenData.split(';')
      const userToken = this.fixToken(userBearerRefreshToken)

      if (!cachedTokens.find(token => token === userToken)) {
        throw new HttpException(EHttpStatus.UNAUTHORIZED, `You aren't authorized on this device.`, ['bearerRefreshToken'])
      }

      const newCachedTokenData = cachedTokens.filter(token => token !== userToken).join(';')

      await redis.setAsync(redisKey, newCachedTokenData)
      return this.successResult(true, EHttpStatus.NO_CONTENT)

    } catch (error: any) {

      return this.errorResult(error)

    }
  }

  public renewUserToken = async (userId: TObjectId, userBearerRefreshToken: string): Promise<TResult<IBearerTokens>> => {
    try {

      const user = await this.userRepository.findUserById(userId)
      const payload: ITokenPayload = {
        _id: user._id
      }
      const redisKey = `refresh-token/${user._id}`
      const cachedTokenData = await redis.getAsync(redisKey)

      if (!cachedTokenData) {
        throw new HttpException(EHttpStatus.UNAUTHORIZED, `You aren't authorized to use renew token method.`, ['bearerRefreshToken'])
      }

      const cachedTokens = cachedTokenData.split(';')
      const userToken = this.fixToken(userBearerRefreshToken)

      if (!cachedTokens.find(token => token === userToken)) {
        throw new HttpException(EHttpStatus.UNAUTHORIZED, `You aren't authorized on this device.`, ['bearerRefreshToken'])
      }

      const newCachedTokens = cachedTokens.filter(token => token !== userToken)
      const tokens: IBearerTokens = {
        bearerAccessToken: generateBearerToken(payload, EToken.ACCESS),
        bearerRefreshToken: generateBearerToken(payload, EToken.REFRESH)
      }

      newCachedTokens.push(this.fixToken(tokens.bearerRefreshToken))

      const newCachedTokenData = newCachedTokens.join(';')

      await redis.setAsync(redisKey, newCachedTokenData)
      return this.successResult(tokens, EHttpStatus.NO_CONTENT)

    } catch (error: any) {

      return this.errorResult(error)

    }
  }

  public restoreUserPassword = async (restorePasswordDTO: RestorePasswordDTO): Promise<TResult<boolean | string>> => {
    const { email, restoreCode, password } = restorePasswordDTO
    let messageId: string | null = null

    const session = await startSession()
    session.startTransaction()

    try {

      const user = await this.userRepository.findUserByEmail(email, session)

      // switch (restoreCode) {
      //   case null:

      //     const code = generateRestoreCode()

      //     await user?.updateOne({
      //       $set: {
      //         "restorePassword.code": code,
      //         "restorePassword.expiresIn": generateExpiresIn(10 * 60) // 10 minutes
      //       }
      //     }, { session })

      //     const transport = nodemailer.createTransport({
      //       host: config.MAIL_HOST,
      //       port: config.MAIL_PORT,
      //       auth: {
      //         user: config.MAIL_USER,
      //         pass: config.MAIL_PASS
      //       }
      //     })

      //     const mailOptions: nodemailer.SendMailOptions = {
      //       from: '',
      //       to: user?.email,
      //       subject: 'Restore password',
      //       text: `There is your restore code: ${code}`,
      //       html: `There is your restore code: <br />${code}`
      //     }

      //     const mailResponse = await transport.sendMail(mailOptions)

      //     if (!mailResponse.messageId) {
      //       throw new HttpException(EHttpStatus.INTERNAL_SERVER_ERROR, 'Mail error')
      //     }

      //     messageId = mailResponse?.messageId

      //     break

      //   case restoreCode:

      //     const restorePassword = user?.get('restorePassword', null, { getters: false, session })

      //     if (restorePassword?.code !== restoreCode) {
      //       throw new HttpException(EHttpStatus.BAD_REQUEST, 'Restore code is invalid', ['restoreCode'])
      //     }

      //     if (!password) {
      //       throw new HttpException(EHttpStatus.BAD_REQUEST, 'New password is missing', ['password'])
      //     }

      //     const hash = await hashPassword(password)

      //     await user?.updateOne({
      //       $set: {
      //         password: hash
      //       }
      //     })

      //     break

      //   default:
      //     throw new HttpException(EHttpStatus.INTERNAL_SERVER_ERROR, 'Unexpected error.')
      // }

      await session.commitTransaction()
      return { type: EServiceResult.SUCCESS, value: messageId || true, status: EHttpStatus.OK }

    } catch (error: any) {

      await session.abortTransaction()
      return this.errorResult(error)

    } finally {

      session.endSession()

    }
  }

  public changeUserPassword = async (userId: TObjectId, changePasswordDTO: ChangePasswordDTO): Promise<TResult<boolean>> => {
    const { newPassword, password } = changePasswordDTO
    const session = await startSession()
    session.startTransaction()

    try {

      const user = await this.userRepository.findUserById(userId, session)

      if (!user) throw new NotFoundException('User', ['_id'])

      if (!await comparePasswords(password, user, session)) {
        throw new HttpException(EHttpStatus.BAD_REQUEST, 'Incorrect password', ['password'])
      }

      const hash = await hashPassword(newPassword)
      const userData: Partial<IUser> = {
        password: hash
      }

      await this.userRepository.modifyUser(user._id, userData, session)

      await session.commitTransaction()
      return this.successResult(true, EHttpStatus.NO_CONTENT)

    } catch (error: any) {

      await session.abortTransaction()
      return this.errorResult(error)

    } finally {

      session.endSession()

    }
  }

  public confirmPassword = async (userId: TObjectId, confirmPasswordDTO: ConfirmPasswordDTO): Promise<TResult<boolean>> => {
    const { password } = confirmPasswordDTO
    const session = await startSession()
    session.startTransaction()

    try {

      const user = await this.userRepository.findUserById(userId, session)

      if (!await comparePasswords(password, user, session)) {
        throw new HttpException(EHttpStatus.BAD_REQUEST, 'Incorrect password', ['password'])
      }

      await session.commitTransaction()
      return this.successResult(true, EHttpStatus.NO_CONTENT)

    } catch (error: any) {

      await session.abortTransaction()
      return this.errorResult(error)

    } finally {

      session.endSession()

    }
  }
}
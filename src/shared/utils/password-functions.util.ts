import bcrypt from 'bcrypt'
import { ClientSession } from 'mongoose'
import * as config from '../../config'
import { IUser } from '../../interfaces'

export const hashPassword = async (password: string): Promise<string> =>
  await bcrypt.hash(password, config.SALT)

export const comparePasswords = async (password: string, user: IUser, session: ClientSession | null = null) =>
  await bcrypt.compare(password, user.password)
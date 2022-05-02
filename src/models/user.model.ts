import { Schema, model, Document } from 'mongoose'
import { IUser } from '../interfaces'

const restorePasswordSchema: Schema = new Schema({
  code: {
    type: String,
    default: null
  },
  expiresIn: {
    type: Date
  }
}, {
  _id: false
})

const userSchema: Schema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },

  email: {
    type: String,
    required: true,
    unique: true
  },

  password: {
    type: String,
    required: true
  },

  restorePassword: {
    type: restorePasswordSchema,
    required: false
  },

  isDeleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
})

export default model<IUser & Document>('User', userSchema, 'users')
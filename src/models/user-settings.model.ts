import { Schema, model, Document, Types } from 'mongoose'
import { IUserSettings } from '../interfaces'

const overallSettingsSchema: Schema = new Schema({
  language: {
    type: String,
    default: 'en'
  },

  currency: {
    type: String,
    default: 'ANY'
  },

  theme: {
    type: Number,
    default: 0
  },
}, {
  _id: false
})

const rollsSettingsSchema: Schema = new Schema({
  syncOnLogin: {
    type: Boolean,
    default: true
  }
}, {
  _id: false
})

const projectsSettingsSchema: Schema = new Schema({
  syncOnLogin: {
    type: Boolean,
    default: true
  }
}, {
  _id: false
})

const ordersSettingsSchema: Schema = new Schema({
  syncOnLogin: {
    type: Boolean,
    default: true
  },

  numbering: {
    type: Number,
    default: 0
  }
}, {
  _id: false
})

const notificationsSettingsSchema: Schema = new Schema({
  isEnabled: {
    type: Boolean,
    default: false
  },

  sounds: {
    type: Boolean,
    default: false
  },

  newOrder: {
    type: Boolean,
    default: false
  },
}, {
  _id: false
})

const userSettingsSchema: Schema = new Schema({
  userId: {
    type: Types.ObjectId,
    required: true,
    unique: true,
  },

  overallSettings: {
    type: overallSettingsSchema,
    default: () => ({})
  },

  rollsSettings: {
    type: rollsSettingsSchema,
    default: () => ({})
  },

  ordersSettings: {
    type: ordersSettingsSchema,
    default: () => ({})
  },

  projectsSettings: {
    type: projectsSettingsSchema,
    default: () => ({})
  },

  notificationsSettings: {
    type: notificationsSettingsSchema,
    default: () => ({})
  },

  isDeleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
})
  .index({ userId: 1 })

export default model<IUserSettings & Document>('UsersSettings', userSettingsSchema, 'users_settings')
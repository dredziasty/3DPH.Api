import { Schema, model, Types, Document } from 'mongoose'
import { IRoll } from '../interfaces'

const rollSchema: Schema = new Schema({
  userId: {
    type: Types.ObjectId,
    required: true,
  },

  filamentId: {
    type: Types.ObjectId,
    required: true
  },

  description: {
    type: String,
    default: null
  },

  url: {
    type: String,
    default: null
  },

  coolingSpeed: {
    type: Number,
    default: 0
  },

  printingTemperature: {
    type: Number,
    default: 0
  },

  bedTemperature: {
    type: Number,
    default: 0
  },

  defaultWeight: {
    type: Number,
    default: 0
  },

  actualWeight: {
    type: Number,
    default: 0
  },

  usedWeight: {
    type: Number,
    default: 0
  },

  rating: {
    type: Number,
    default: null
  },

  archivisedAt: {
    type: Date,
    default: null
  },

  isFinished: {
    type: Boolean,
    default: false
  },

  isSample: {
    type: Boolean,
    default: false
  },

  isActive: {
    type: Boolean,
    default: false
  },

  isDeleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
})
  .index({ userId: 1, key: 1 }, { unique: true })

export default model<IRoll & Document>('Roll', rollSchema, 'rolls')
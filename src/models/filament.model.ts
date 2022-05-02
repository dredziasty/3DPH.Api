import { Schema, model, Types, Document } from 'mongoose'
import { IFilament } from '../interfaces'

const filamentSchema: Schema = new Schema({
  userId: {
    type: Types.ObjectId,
    required: true
  },

  type: {
    type: String,
    required: true
  },

  brand: {
    type: String,
    required: true
  },

  diameter: {
    type: Number,
    required: true
  },

  color: {
    type: String,
    required: true
  },

  colorHex: {
    type: String
  },

  name: {
    type: String
  },

  description: {
    type: String
  },

  isDeleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
})

export default model<IFilament & Document>('Filament', filamentSchema, 'filaments')
import { IProject } from '../interfaces'
import { Schema, model, Types, Document } from 'mongoose'

const fileSchema: Schema = new Schema({
  name: {
    type: String
  },

  extension: {
    type: String
  }
}, {
  timestamps: true
})

const projectSchema: Schema = new Schema({
  userId: {
    type: Types.ObjectId,
    required: true,
  },

  name: {
    type: String,
    required: true,
  },

  files: {
    type: [fileSchema]
  },

  isDeleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
})
  .index({ userId: 1 })

export default model<IProject & Document>('Project', projectSchema, 'projects')
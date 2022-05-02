import { Schema, model, Types, Document } from 'mongoose'
import { IOrder } from '../interfaces'

const orderItemSchema: Schema = new Schema({
  name: {
    type: String,
    required: true
  },

  color: {
    type: String,
    required: true
  },

  price: {
    type: Number,
    required: true
  },

  amount: {
    type: Number,
    required: true
  },
})

const customerSchema: Schema = new Schema({
  name: {
    type: String,
    required: true
  },

  phoneNumber: {
    type: String,
    required: true
  },
})

const orderSchema: Schema = new Schema({
  userId: {
    type: Types.ObjectId,
    required: true
  },

  name: {
    type: String,
    required: true
  },

  number: {
    type: Number,
    required: true,
    default: 0
  },

  value: {
    type: Number,
    required: true
  },

  extraCost: {
    type: Number,
    default: 0
  },

  description: {
    type: String
  },

  customer: {
    type: customerSchema,
    required: true
  },

  items: {
    type: [orderItemSchema],
    required: true
  },

  plannedCompletionAt: {
    type: Date,
    default: null
  },

  completedAt: {
    type: Date,
    default: null
  },

  archivisedAt: {
    type: Date,
    default: null
  },

  isDeleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
})

export default model<IOrder & Document>('Order', orderSchema, 'orders')
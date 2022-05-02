import express, { Application, json } from 'express';
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import mongoose from 'mongoose'
import AWS from 'aws-sdk'
import { default as redis } from './redis'
import { IControllerBase } from './interfaces'
import * as config from './config'
import { logControllers } from './shared/utils'
import { errorMiddleware, routeNotFoundMiddleware } from './middlewares'

class App {
  public app: Application
  private controllers: Array<IControllerBase>

  constructor(controllers: Array<IControllerBase>) {
    this.app = express()
    this.controllers = controllers

    this.initializeMiddlewares()
    this.initializeControllers(controllers)
    this.initializeErrorHandling()
    this.initializeRouteNotFoundHandling()
    this.setupMongoDB()
    this.setupAWS()
    this.setupRedis()
  }

  public listen(): void {
    this.app.listen(config.PORT, () => {
      console.log(`\nAPI (${config.API_VERSION}) is running on port ${config.PORT}\n`)
      console.log(`${config.NODE_ENV.charAt(0).toUpperCase() + config.NODE_ENV.slice(1)} mode\n`)

      logControllers(this.controllers)
    })
  }

  private initializeMiddlewares(): void {
    this.app.use(json({ limit: '100mb' }))
    this.app.use(cors())
    this.app.use(helmet())
    this.app.use(morgan('tiny'))
  }

  private initializeErrorHandling() {
    this.app.use(errorMiddleware)
  }

  private initializeRouteNotFoundHandling() {
    this.app.use(routeNotFoundMiddleware)
  }

  private initializeControllers(controllers: Array<IControllerBase>): void {
    controllers.forEach((controller: IControllerBase) => {
      this.app.use('/api/', controller.router)
    })
  }

  private async setupMongoDB() {
    try {
      const db = await mongoose.connect(config.MONGODB_URI, {
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
      })
      console.log(`\nMongoDB connected successfully`)
      console.log(`MongoDB collection: ${db.connections[0].name}`)
      console.log(`MongoDB models: ${Object.keys(db.models).join(', ')}\n`)
    } catch (error: any) {
      throw new Error(error)
    }
  }

  private async setupAWS() {
    AWS.config.update({
      region: config.AWS_REGION
    })

    const s3 = new AWS.S3()

    try {
      await s3.listBuckets()
      console.log(`\nAWS S3 connected successfully`)
    } catch (error: any) {
      throw new Error(error)
    }
  }

  private async setupRedis() {
    try {
      await redis.setAsync('testKey', new Date().toISOString())
      console.log('\nRedis connected successfully')
    } catch (error: any) {
      throw new Error(error)
    }
  }
}

export default App
import * as config from '../config'
import { HttpException } from '../shared/exceptions'
import AWS from 'aws-sdk'

export class AWSS3Helper {
  private bucket: string
  private s3: AWS.S3

  constructor() {
    this.bucket = config.AWS_BUCKET
    this.s3 = new AWS.S3()
  }

  public async putObject(key: string, body?: Buffer) {
    const s3Result = await this.s3.putObject({
      Bucket: this.bucket,
      Key: key,
      Body: body
    }).promise()

    if (s3Result instanceof Error) throw new HttpException()

    return s3Result
  }

  public async getObject(key: string) {
    const s3Result = await this.s3.getObject({
      Bucket: this.bucket,
      Key: key
    }).promise()

    if (s3Result instanceof Error) throw new HttpException()

    return s3Result
  }

  public async deleteObject(key: string) {
    const s3Result = await this.s3.deleteObject({
      Bucket: this.bucket,
      Key: key
    }).promise()

    if (s3Result instanceof Error) throw new HttpException()

    return s3Result
  }

  public async deleteDir(prefix: string) {

    const objects = await this.s3.listObjectsV2({
      Bucket: this.bucket,
      Prefix: prefix
    }).promise()

    if (objects instanceof Error) throw new HttpException()

    if (objects.Contents?.length != 0) {
      const objectsToDelete: any[] = []

      objects.Contents?.forEach(({ Key }) => {
        objectsToDelete.push({ Key })
      })

      await this.s3.deleteObjects({
        Bucket: this.bucket,
        Delete: { Objects: objectsToDelete }
      }).promise()
    }

    return await this.deleteObject(prefix)
  }
}
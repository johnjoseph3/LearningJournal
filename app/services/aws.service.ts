import {
  S3Client,
  DeleteObjectCommand,
  PutObjectCommand
} from "@aws-sdk/client-s3"
import { loggerService } from "@/app/services/logger.service"

class AWSService {
  private s3Client: S3Client
  private region: string

  constructor() {
    this.region = process.env.AWS_REGION || "us-east-1"
    this.s3Client = new S3Client({
      region: process.env.AWS_REGION || "us-east-1",
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
      }
    })
  }

  async deleteS3Image(url: string): Promise<void> {
    const bucket = url.split(".s3.")[0].split("https://")[1]
    const key = url.split(".amazonaws.com/")[1]

    if (key) {
      const deleteParams = {
        Bucket: bucket,
        Key: key
      }

      try {
        await this.s3Client.send(new DeleteObjectCommand(deleteParams))
      } catch (err: any) {
        const message = err.message || "Error deleting image from S3"
        loggerService.logError(message)
        throw new Error(message)
      }
    }
  }

  async uploadS3Image(
    userId: string,
    bucket: string,
    fileName: string,
    body: Buffer,
    contentType: string,
  ): Promise<string> {
    const timestamp = new Date().toISOString().replace(/[:.-]/g, "")
    const uniqueFileName = `${timestamp}-${fileName}`
    const key = `${userId}/images/${uniqueFileName}`
    const uploadParams = {
      Bucket: bucket,
      Key: key,
      Body: body,
      ContentType: contentType
    }

    try {
      await this.s3Client.send(new PutObjectCommand(uploadParams))
      const publicUrl = `https://${bucket}.s3.${this.region}.amazonaws.com/${key}`
      return publicUrl
    } catch (err: any) {
      const message = err.message || "Error uploading image to S3"
      loggerService.logError(message)
      throw new Error(message)
    }
  }
}

export const awsService = new AWSService()

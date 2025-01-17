import {
  S3Client,
  DeleteObjectCommand,
  PutObjectCommand
} from "@aws-sdk/client-s3"
import { PrismaClient } from "@prisma/client"

class AWSService {
  private s3Client: S3Client
  private prisma: PrismaClient
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

    this.prisma = new PrismaClient()
  }

  async deleteS3Image(url: string): Promise<void> {
    const bucket = url.split(".s3.")[0].split("https://")[1]
    const key = url.split(".amazonaws.com/")[1]

    if (key) {
      const deleteParams = {
        Bucket: bucket,
        Key: key
      }

      await this.s3Client.send(new DeleteObjectCommand(deleteParams))
    }
  }

  async uploadS3Image(
    bucket: string,
    key: string,
    body: Buffer,
    contentType: string
  ): Promise<string> {
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
    } catch (err) {
      throw new Error("Error uploading image to S3")
    }
  }
}

export const awsService = new AWSService()

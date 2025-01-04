import { auth } from "@/auth.ts"
import {
  S3Client,
  PutObjectCommand,
} from "@aws-sdk/client-s3"

const awsRegion = process.env.AWS_REGION || "us-east-1"

const s3Client = new S3Client({
  region: awsRegion,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
  }
})

export const POST = auth(async (req, context) => {
  if (req.auth) {
    const fileType =
      req.headers.get("content-type") || "application/octet-stream"
    const fileName = req.headers.get("x-vercel-filename") || "image.png"

    if (!req.body) {
      return new Response(JSON.stringify({ message: "No file uploaded" }), {
        status: 400
      })
    }

    const reader = req.body.getReader()
    const chunks: Uint8Array[] = []

    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      chunks.push(value)
    }

    const fileBuffer = Buffer.concat(chunks)

    const uploadParams = {
      Bucket: process.env.AWS_S3_IMAGE_BUCKET!,
      Key: fileName,
      Body: fileBuffer,
      ContentType: fileType
    }

    try {
      await s3Client.send(new PutObjectCommand(uploadParams))

      const publicUrl = `https://${process.env.AWS_S3_IMAGE_BUCKET}.s3.${awsRegion}.amazonaws.com/${fileName}`
      return new Response(JSON.stringify({ url: publicUrl }), { status: 200 })
    } catch (err) {
      console.error("Error uploading file:", err)
      return new Response(JSON.stringify({ message: "Error uploading file" }), {
        status: 500
      })
    }
  }

  return new Response(JSON.stringify({ message: "Not authenticated" }), {
    status: 401
  })
}) as any

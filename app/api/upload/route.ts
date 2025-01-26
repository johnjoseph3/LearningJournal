import { auth } from "@/auth.ts"
import { awsService } from "@/app/services/aws/aws.service"
import { loggerService } from "@/app/services/logger/logger.service"

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

    try {
      const url = await awsService.uploadS3Image(
        req.auth.user?.id as string,
        process.env.AWS_S3_IMAGE_BUCKET!,
        fileName,
        fileBuffer,
        fileType
      )
      return new Response(JSON.stringify({ url }), { status: 200 })
    } catch (err: any) {
      const message = err.message || "Error uploading image to S3"
      loggerService.logError(message)
      return new Response(JSON.stringify({ message }), {
        status: 500
      })
    }
  }

  return new Response(JSON.stringify({ message: "Not authenticated" }), {
    status: 401
  })
}) as any

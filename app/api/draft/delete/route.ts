import { auth } from "@/auth.ts"
import { tipTapService } from "@/app/services/tiptap.service"

export const POST = auth(async (req) => {
  if (req.auth) {
    const body = await req.json()
    tipTapService.deleteDraft(body.draft.content)

    return Response.json({ message: "Success", status: 200 })
  }

  return Response.json({ message: "Not authenticated" }, { status: 401 })
}) as any

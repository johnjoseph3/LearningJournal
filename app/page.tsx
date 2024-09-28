import { auth } from "@/auth.ts"

export default async function Index() {
  const session = await auth()

  return (
    <div className="flex flex-col gap-6">
      <h1>Learning Journal</h1>
      <div className="flex flex-col rounded-md">
        <div className="rounded-t-md bg-secondary p-4 font-bold">
          Current Session
        </div>
        <pre className="whitespace-pre-wrap break-all px-4 py-6 border">
          {JSON.stringify(session, null, 2)}
        </pre>
      </div>
    </div>
  )
}

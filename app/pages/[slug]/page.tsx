"use client"

import { useState } from "react"
import Entries from "@/components/page/entries.tsx"
import Skeleton from "@/components/skeleton"
import useSWR from "swr"
import { type JSONContent } from "novel"
import { toast } from "sonner"

export default function Page({ params }: { params: { slug: string } }) {
  const [content, setContent] = useState<JSONContent>()
  const { data, error, isLoading, mutate } = useSWR(
    `/api/page/find-one/${params.slug}`,
    (url: string) => fetch(url).then((r) => r.json())
  )

  if (error) return "error"

  if (isLoading) return <Skeleton />

  const onChange = (val: JSONContent) => {
    setContent(val)
  }

  const onSubmit = async () => {
    const body = {
      pageId: data.page.id,
      content
    }

    await fetch("/api/entry/create", {
      method: "POST",
      body: JSON.stringify(body)
    })

    toast("Entry has been created")

    mutate({
      page: {
        ...data.page,
        entries: [
          ...data.page.entries,
          {
            content
          }
        ]
      }
    })
  }

  // empty object represents blank, editable editor
  const entries = [...data.page.entries, {}].map((entry) => {
    return {
      ...entry,
      editable: JSON.stringify(entry) === "{}"
    }
  })

  return <Entries entries={entries} onChange={onChange} onSubmit={onSubmit} />
}

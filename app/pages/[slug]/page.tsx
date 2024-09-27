"use client"

import { useState } from "react"
import Entries from "@/components/page/entries.tsx"
import useSWR from "swr"
import { type JSONContent } from "novel"

export default function Page({ params }: { params: { slug: string } }) {
  const [content, setContent] = useState<JSONContent>()
  const { data, error, isLoading, mutate } = useSWR(
    `/api/page/find-one/${params.slug}`,
    (url: string) => fetch(url).then((r) => r.json())
  )

  if (error) return <div>failed to load</div>
  if (isLoading) return <div>loading...</div>

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

    setContent({})

    mutate()
  }

  return (
    <Entries
      entries={data.page.entries}
      onChange={onChange}
      onSubmit={onSubmit}
    />
  )
}

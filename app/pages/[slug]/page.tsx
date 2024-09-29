"use client"

import { useState } from "react"
import Entries, { EntryData } from "@/components/page/entries.tsx"
import Skeleton from "@/components/skeleton"
import useSWR from "swr"
import { type JSONContent } from "novel"
import { toast } from "sonner"
import { v4 as uuidv4 } from "uuid"

// blankEntry represents blank, editable editor
const blankId = uuidv4()
const blankEntry = { id: blankId }

export default function Page({ params }: { params: { slug: string } }) {
  const [content, setContent] = useState<JSONContent>()
  const [isBlankVisible, setIsBlankVisible] = useState(false)

  const { data, error, isLoading, mutate } = useSWR(
    `/api/page/find-one/${params.slug}`,
    (url: string) => fetch(url).then((r) => r.json())
  )

  if (error) return "error"

  if (isLoading) return <Skeleton />

  const handleChange = (val: JSONContent) => {
    setContent(val)
  }

  const handleSave = async () => {
    const body = {
      pageId: data.page.id,
      content,
      order: data.page.entries.length + 1
    }

    const res = await fetch("/api/entry/create", {
      method: "POST",
      body: JSON.stringify(body)
    })

    // TODO clear content in blankEntry

    if (!res.ok) {
      toast("Could not create entry")
      return
    }

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

  async function handleDragEnd(newOrderedEntries: EntryData[]) {
    const res = await fetch("/api/entry/reflow", {
      method: "POST",
      body: JSON.stringify(newOrderedEntries.filter((entry) => !entry.blank))
    })

    if (!res.ok) {
      toast("Could not reorder entries")
      return
    }

    mutate({
      page: {
        ...data.page,
        entries: newOrderedEntries
      }
    })
  }

  async function handleDelete(id: number) {
    const res = await fetch("/api/entry/delete", {
      method: "POST",
      body: JSON.stringify({ id, pageId: data.page.id })
    })

    if (!res.ok) {
      toast("Could not delete entry")
      return
    }

    const filtered = data.page.entries.filter(
      (entry: EntryData) => entry.id !== id
    )

    toast("Entry has been deleted")

    mutate({
      page: {
        ...data.page,
        entries: filtered
      }
    })
  }

  function handleNewEntry() {
    setIsBlankVisible(true)
  }

  const entries = [
    ...data.page.entries,
    { ...blankEntry, order: data.page.entries.length + 1 }
  ].map((entry) => {
    return {
      ...entry,
      editable: entry.id === blankId,
      blank: entry.id === blankId,
      visible: entry.id !== blankId || isBlankVisible
    }
  })

  return (
    <Entries
      entries={entries}
      onChange={handleChange}
      onSave={handleSave}
      onDragEnd={handleDragEnd}
      onDelete={handleDelete}
      onNewEntry={handleNewEntry}
    />
  )
}

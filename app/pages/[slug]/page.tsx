"use client"

import { useState } from "react"
import Entries, { EntryData } from "@/components/page/entries.tsx"
import Skeleton from "@/components/skeleton"
import useSWR from "swr"
import { type JSONContent } from "novel"
import { toast } from "sonner"
import { v4 as uuidv4 } from "uuid"

export default function Page({ params }: { params: { slug: string } }) {
  const [content, setContent] = useState<JSONContent>()
  const [blankEntry, setBlankEntry] = useState({
    id: uuidv4(),
    content: undefined,
    blank: true,
    editable: true,
    visible: false
  })

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

    setBlankEntry({
      id: uuidv4(),
      content: undefined,
      blank: true,
      editable: true,
      visible: false
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

  async function handleDelete(entry: EntryData) {
    if (entry.blank) {
      setBlankEntry({
        ...blankEntry,
        visible: false
      })
      return
    }

    const id = entry.id

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
    setBlankEntry({
      ...blankEntry,
      visible: true
    })
  }

  const entries = [
    ...data.page.entries,
    { ...blankEntry, order: data.page.entries.length + 1 }
  ].map((entry) => {
    if (!entry.blank) {
      entry.visible = true
    }
    return entry
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

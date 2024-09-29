"use client"

import { useState } from "react"
import Entries, { EntryData } from "@/components/page/entries.tsx"
import Skeleton from "@/components/skeleton"
import useSWR from "swr"
import { type JSONContent } from "novel"
import { toast } from "sonner"
import { v4 as uuidv4 } from "uuid"

const fetcher = async (url: string) => {
  const res = await fetch(url)

  if (!res.ok) {
    const error: any = new Error("An error occurred while fetching the data.")
    error.info = await res.json()
    error.status = res.status
    throw error
  }

  return res.json()
}

export default function Page({ params }: { params: { slug: string } }) {
  const [content, setContent] = useState<
    { id: number | string; content: JSONContent }[]
  >([])
  const [currentlyEditingId, setCurrentlyEditingId] = useState<
    number | string | null
  >(null)
  const [blankEntry, setBlankEntry] = useState({
    id: uuidv4(),
    content: undefined,
    blank: true,
    editable: true,
    visible: false
  })

  const { data, error, isLoading, mutate } = useSWR(
    `/api/page/find-one/${params.slug}`,
    fetcher
  )

  if (error)
    return error?.info?.message || "An error occurred while fetching the data."

  if (isLoading) return <Skeleton />

  const handleChange = (id: number, val: JSONContent) => {
    if (!content?.find((item) => item.id === id)) {
      setContent([...content, { id, content: val }])
      return
    }

    setContent((prevItems) => {
      return prevItems?.map((item) => {
        if (item.id === id) {
          item.content = val
        }
        return item
      })
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

  const handleSave = async (entry: EntryData) => {
    const editedContent = content.find((item) => item.id === entry.id)
    if (!editedContent) {
      return
    }

    if (entry.blank) {
      const body = {
        pageId: data.page.id,
        content: editedContent.content,
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
    } else {
      const body = {
        id: entry.id,
        content: editedContent.content
      }

      const res = await fetch("/api/entry/update", {
        method: "POST",
        body: JSON.stringify(body)
      })

      if (!res.ok) {
        toast("Could not update entry")
        return
      }

      toast("Entry has been updated")

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

    setBlankEntry({
      id: uuidv4(),
      content: undefined,
      blank: true,
      editable: true,
      visible: false
    })
    setCurrentlyEditingId(null)
  }

  async function handleDelete(entry: EntryData) {
    if (entry.blank) {
      setBlankEntry({
        ...blankEntry,
        visible: false
      })
      setCurrentlyEditingId(null)
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

  async function handleEdit(entry: EntryData) {
    setCurrentlyEditingId(entry.id)
  }

  function handleNewEntry() {
    setBlankEntry({
      ...blankEntry,
      visible: true
    })
    setCurrentlyEditingId(blankEntry.id)
  }

  const entries = [
    ...data.page.entries,
    { ...blankEntry, order: data.page.entries.length + 1 }
  ].map((entry) => {
    // TODO this up. consider a different strategy for storing/attaching this metadata

    if (currentlyEditingId && entry.id === currentlyEditingId) {
      entry.visible = true
      entry.editable = true
    } else if (!currentlyEditingId && entry.blank) {
      entry.visible = false
      entry.editable = true
    } else {
      entry.visible = true
      entry.editable = false
    }
    return entry
  })

  return (
    <Entries
      entries={entries}
      onChange={handleChange}
      onSave={handleSave}
      onEdit={handleEdit}
      onDragEnd={handleDragEnd}
      onDelete={handleDelete}
      onNewEntry={handleNewEntry}
    />
  )
}

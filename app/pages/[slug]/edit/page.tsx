"use client"

import { useState } from "react"
import EntriesEditor, { EntryData } from "@/components/page/entries-editor.tsx"
import Skeleton from "@/components/skeleton"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import useSWR from "swr"
import { type JSONContent } from "novel"
import { toast } from "sonner"
import { v4 as uuidv4 } from "uuid"
import TopicNameInput from "@/components/topic/topic-name-input"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog"
import { useRouter } from "next/navigation"

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

export default function EditEntries({ params }: { params: { slug: string } }) {
  const { slug } = params
  const router = useRouter()

  const { data, error, isLoading, mutate } = useSWR(
    `/api/page/find-one/${slug}`,
    fetcher
  )

  const [content, setContent] = useState<
    { id: number | string; content: JSONContent }[]
  >([])
  const [currentlyEditingId, setCurrentlyEditingId] = useState<
    number | string | null
  >(null)
  const [isEditingName, setIsEditingName] = useState(false)
  const [blankEntry, setBlankEntry] = useState({
    id: uuidv4(),
    content: undefined,
    blank: true,
    editable: true,
    visible: false
  })

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

  async function handleEntryDelete(entry: EntryData) {
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

  async function handleDraftToggle(entry: EntryData) {
    const newDraftStatus = !entry.draft
    const body = {
      id: entry.id,
      draft: !entry.draft
    }

    const res = await fetch("/api/entry/update", {
      method: "POST",
      body: JSON.stringify(body)
    })

    if (!res.ok) {
      toast("Could not update entry")
      return
    }

    if (!newDraftStatus) {
      toast("Entry has been published")
    } else {
      toast("Entry is in draft mode")
    }

    mutate({
      page: {
        ...data.page,
        entries: [
          [...data.page.entries].map((e) => {
            if (e.id === entry.id) {
              entry.draft = newDraftStatus
            }
            return entry
          })
        ]
      }
    })
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
    if (!entry.blank) {
      entry.visible = true
    }

    if (currentlyEditingId === entry.id) {
      entry.editable = true
    } else {
      entry.editable = false
    }

    return entry
  })

  async function handleTogglePublic(isPublic: boolean) {
    const body = {
      id: data.page.id,
      public: isPublic
    }

    const res = await fetch("/api/page/update", {
      method: "POST",
      body: JSON.stringify(body)
    })

    if (!res.ok) {
      toast("Could not update page")
      return
    }

    toast(`Page is ${isPublic ? "public" : "private"}`)

    mutate({
      page: {
        ...data.page,
        public: isPublic
      }
    })
  }

  async function handleTopicDelete() {
    const body = {
      id: data.page.topic.id
    }

    const res = await fetch("/api/topic/delete", {
      method: "POST",
      body: JSON.stringify(body)
    })

    if (!res.ok) {
      toast("Could not delete topic")
      return
    }

    router.push("/topics")
  }

  async function handleNameChange(name: string) {
    if (name) {
      const body = {
        id: data.page.topic.id,
        name
      }

      const res = await fetch("/api/topic/update", {
        method: "POST",
        body: JSON.stringify(body)
      })

      if (!res.ok) {
        toast("Could not update topic")
        return
      }

      mutate({
        page: {
          ...data.page,
          topic: {
            ...data.page.topic,
            name
          }
        }
      })
    }
  }

  function handleTopicNameBlur() {
    setIsEditingName(false)
  }

  return (
    <>
      <div className="flex justify-between mb-10">
        <div>
          {isEditingName && data ? (
            <TopicNameInput
              initialName={data.page.topic.name}
              onBlur={handleTopicNameBlur}
              onChange={handleNameChange}
            />
          ) : (
            <h1
              className="font-bold leading-tight text-3xl cursor-pointer"
              onClick={() => setIsEditingName(true)}
            >
              {data?.page?.topic?.name}
            </h1>
          )}
          {data.page.public ? (
            <div>
              <a
                href={data.publicUrl}
                className="inline-flex items-center font-medium text-blue-600 dark:text-blue-500 hover:underline"
              >
                Public page
              </a>
            </div>
          ) : null}
        </div>

        <div className="flex flex-col">
          <div className="flex items-center space-x-2 mb-2">
            <Switch
              id="public"
              checked={data.page.public}
              onCheckedChange={handleTogglePublic}
            />
            <Label htmlFor="public">Public</Label>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="destructive">Delete</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  Are you sure you want to delete {data.page.topic.name}?
                </DialogTitle>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="destructive" onClick={handleTopicDelete}>
                      Delete
                    </Button>
                  </DialogClose>
                </DialogFooter>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <EntriesEditor
        entries={entries}
        onChange={handleChange}
        onSave={handleSave}
        onEdit={handleEdit}
        onDraftToggle={handleDraftToggle}
        onDragEnd={handleDragEnd}
        onDelete={handleEntryDelete}
        onNewEntry={handleNewEntry}
      />
    </>
  )
}

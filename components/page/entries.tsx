"use client"

import { Entry } from "@prisma/client"
import { type JSONContent } from "novel"
import SortableLinks from "@/components/sortable-links"
import Editor from "@/components/editor/advanced-editor.tsx"
import { Button } from "@/components/ui/button.tsx"
import { toast } from "sonner"

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors
} from "@dnd-kit/core"

import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy
} from "@dnd-kit/sortable"

import {
  restrictToVerticalAxis,
  restrictToParentElement
} from "@dnd-kit/modifiers"

export interface EntryData extends Entry {
  editable: boolean
  blank: boolean
  visible: boolean
}

export default function Entries(props: {
  entries: EntryData[]
  onChange: (id: number, val: JSONContent) => void
  onDragEnd: (entries: EntryData[]) => void
  onDelete: (entry: EntryData) => void
  onSave: (entry: EntryData) => void
  onEdit: (entry: EntryData) => void
  onNewEntry: () => void
}) {
  const { entries, onChange, onSave, onEdit, onDragEnd, onDelete, onNewEntry } =
    props

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  )

  async function handleDragEnd(event: any) {
    const { active, over } = event

    const oldIndex = entries.findIndex((item) => item.id === active.id)
    const newIndex = entries.findIndex((item) => item.id === over.id)
    const newOrder = arrayMove(entries, oldIndex, newIndex)

    const activeEntry = entries.find((entry) => entry.id === active.id)
    const overEntry = entries.find((entry) => entry.id === over.id)

    if (activeEntry?.blank || overEntry?.blank) {
      toast("save entry before reordering")
      return
    }

    if (active.id !== over.id) {
      onDragEnd(newOrder)
    }
  }

  function handleDelete(id: number) {
    const entry = entries.find((entry) => entry.id === id)
    if (entry) {
      onDelete(entry)
    }
  }

  function handleSave(id: number) {
    const entry = entries.find((entry) => entry.id === id)
    if (entry) {
      onSave(entry)
    }
  }

  function handleEdit(id: number) {
    const entry = entries.find((entry) => entry.id === id)
    if (entry) {
      onEdit(entry)
    }
  }

  return (
    <div>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToVerticalAxis, restrictToParentElement]}
      >
        <SortableContext items={entries} strategy={verticalListSortingStrategy}>
          {entries.map((entry) => {
            const content = entry?.content as JSONContent

            return entry.visible ? (
              <SortableLinks
                key={entry.id}
                id={entry}
                onDelete={handleDelete}
                onSave={handleSave}
                onEdit={handleEdit}
                sortable={!entry.blank}
                editable={entry?.editable}
              >
                <Editor
                  key={entry.id}
                  initialValue={content}
                  onChange={onChange}
                  editable={entry?.editable}
                  id={entry.id}
                />
              </SortableLinks>
            ) : null
          })}
        </SortableContext>
      </DndContext>
      <Button onClick={onNewEntry} variant="ghost" className="mt-2">
        New entry
      </Button>
    </div>
  )
}

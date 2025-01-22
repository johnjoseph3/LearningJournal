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
}

export default function EntriesEditor(props: {
  entries: EntryData[]
  onChange: (id: number, val: JSONContent) => void
  onDragEnd: (entries: EntryData[]) => void
  onDelete: (entry: EntryData) => void
  onDraftToggle: (entry: EntryData) => void
  onNewEntry: () => void
}) {
  const { entries, onChange, onDraftToggle, onDragEnd, onDelete, onNewEntry } =
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

    if (active.id !== over.id) {
      onDragEnd(newOrder)
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
            return (
              <SortableLinks
                key={entry.id}
                id={entry}
                onDelete={onDelete}
                onDraftToggle={onDraftToggle}
                entry={entry}
              >
                <Editor
                  initialValue={content}
                  onChange={onChange}
                  editable={entry?.editable}
                  id={entry.id}
                />
              </SortableLinks>
            )
          })}
        </SortableContext>
      </DndContext>
      <Button onClick={onNewEntry} variant="ghost" className="mt-2">
        New entry
      </Button>
    </div>
  )
}

"use client"

import { Entry } from "@prisma/client"
import EntryEditor from "../entry/entry-editor.tsx"
import { type JSONContent } from "novel"
import SortableLinks from "@/components/sortable-links"
import { useState } from "react"
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
  onChange: (val: JSONContent) => void
  onSave: () => void
  onDragEnd: (entries: EntryData[]) => void
  onDelete: (entry: EntryData) => void
  onNewEntry: () => void
}) {
  const { entries, onChange, onSave, onDragEnd, onDelete, onNewEntry } = props

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
            return entry.visible ? (
              <SortableLinks
                key={entry.id}
                id={entry}
                onDelete={handleDelete}
                sortable={!entry.blank}
              >
                order: {entry.order}
                <EntryEditor
                  key={entry.id}
                  entry={entry}
                  onChange={onChange}
                  onSave={onSave}
                />
              </SortableLinks>
            ) : null
          })}
        </SortableContext>
      </DndContext>
      <Button onClick={onNewEntry}>New entry</Button>
    </div>
  )
}

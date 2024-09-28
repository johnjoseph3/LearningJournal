"use client"

import { Entry } from "@prisma/client"
import EntryEditor from "../entry/entry-editor.tsx"
import { type JSONContent } from "novel"
import SortableLinks from "@/components/sortable-links"
import { useState } from "react"
import { Button } from "@/components/ui/button.tsx"

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
}) {
  const { entries, onChange, onSave } = props
  const [dragItems, setDragItems] = useState(entries)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  )

  async function handleDragEnd(event: any) {
    const { active, over } = event

    if (active.id !== over.id) {
      const oldIndex = dragItems.findIndex((item) => item.id === active.id)
      const newIndex = dragItems.findIndex((item) => item.id === over.id)
      const newOrder = arrayMove(dragItems, oldIndex, newIndex)
      setDragItems(newOrder)

      await fetch("/api/entry/reflow", {
        method: "POST",
        // filter out blank
        body: JSON.stringify(newOrder.filter((entry) => entry.pageId))
      })
    }
  }

  function handleDelete(idToDelete: number) {
    setDragItems((prevItems) =>
      prevItems.filter((item) => item.id !== idToDelete)
    )
  }

  function handleNewEntry() {
    setDragItems((prevItems) =>
      prevItems.map((entry) => {
        return {
          ...entry,
          visible: true
        }
      })
    )
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
          {dragItems.map((entry) => {
            return entry.visible ? (
              <SortableLinks key={entry.id} id={entry} onDelete={handleDelete}>
                {entry.id}
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
      <Button onClick={handleNewEntry}>New entry</Button>
    </div>
  )
}

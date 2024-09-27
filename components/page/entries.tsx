"use client"

import { Entry } from "@prisma/client"
import EntryEditor from "../entry/entry-editor.tsx"
import { type JSONContent } from "novel"
import SortableLinks from "@/components/sortable-links"

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

export default function Entries(props: {
  entries: EntryData[]
  onChange: (val: JSONContent) => void
  onSubmit: () => void
}) {
  const { entries, onChange, onSubmit } = props

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  )

  function handleDelete(idToDelete: number) {
    //   setItems((prevItems) => prevItems.filter((item) => item.id !== idToDelete))
  }

  const sortedEntries = [...entries].sort((a, b) => b.order - a.order)

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      // onDragEnd={handleDragEnd}
      modifiers={[restrictToVerticalAxis, restrictToParentElement]}
    >
      <SortableContext items={entries} strategy={verticalListSortingStrategy}>
        {sortedEntries.reverse().map((entry) => (
          <SortableLinks key={entry.id} id={entry} onDelete={handleDelete}>
            {entry.order}
            <EntryEditor
              key={entry.id}
              entry={entry}
              onChange={onChange}
              onSave={onSubmit}
            />
          </SortableLinks>
        ))}
      </SortableContext>
    </DndContext>
  )
}

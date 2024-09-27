"use client"

import { Entry } from "@prisma/client"
import EntryEditor from "../entry/entry-editor.tsx"
import { type JSONContent } from "novel"

export interface EntryData extends Entry {
  editable: boolean
}

export default function Entries(props: {
  entries: EntryData[]
  onChange: (val: JSONContent) => void
  onSubmit: () => void
}) {
  const { entries, onChange, onSubmit } = props

  return (
    <div>
      {entries.map((entry) => {
        return (
          <EntryEditor
            key={entry.id}
            entry={entry}
            onChange={onChange}
            onSave={onSubmit}
          />
        )
      })}
    </div>
  )
}

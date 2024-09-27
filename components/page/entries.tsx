"use client"

import { Entry } from "@prisma/client"
import EntryEditor from "../entry/entry-editor.tsx"
import { type JSONContent } from "novel"

export default function Entries(props: {
  entries: Entry[]
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
            editing={false}
            onChange={onChange}
            onSave={onSubmit}
          />
        )
      })}
      <EntryEditor onChange={onChange} onSave={onSubmit} />
    </div>
  )
}

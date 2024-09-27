"use client"

import { type JSONContent } from "novel"
import Editor from "@/components/editor/advanced-editor.tsx"
import { Button } from "@/components/ui/button.tsx"
import { EntryData } from "../page/entries"

export default function EntryEditor(props: {
  entry?: EntryData
  onChange: (val: JSONContent) => void
  onSave: () => void
}) {
  const { entry, onChange, onSave } = props
  const content = entry?.content as JSONContent

  return (
    <>
      <Editor
        initialValue={content}
        onChange={onChange}
        editable={entry?.editable}
      />
      {entry?.editable && <Button onClick={onSave}>Save</Button>}
    </>
  )
}

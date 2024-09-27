'use client'

import {
    type JSONContent,
} from "novel";
import Editor from '@/components/editor/advanced-editor.tsx'
import { Button } from "@/components/ui/button.tsx"
import { Entry } from "@prisma/client"

export default function EntryEditor(
    props: { entry?: Entry, editing?: boolean, onChange: (val: JSONContent) => void, onSave: () => void }
) {
    const { entry, editing = true, onChange, onSave } = props
    const content = entry?.content as JSONContent

    return (
        <>
            <Editor
                initialValue={content}
                onChange={onChange}
                editable={editing} />
            {
                editing && <Button onClick={onSave}>Save</Button>
            }
        </>
    )
}

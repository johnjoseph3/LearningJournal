'use client'

import { Entry } from "@prisma/client"
import EntryEditor from "../entry/entry-editor.tsx"
import { useState } from "react"
import {
    type JSONContent,
} from "novel";

export default function Entries(props: { entries: Entry[], pageId: number }) {
    const { entries, pageId } = props;
    const [content, setContent] = useState<JSONContent>()

    const onChange = (val: JSONContent) => {
        setContent(val)
    }

    const onSubmit = async () => {
        const body = {
            pageId,
            content
        }

        const res = await fetch("/api/entry/create",
            {
                method: "POST",
                body: JSON.stringify(body),
            }
        )
        await res.json()
    }

    if (!entries.length) {
        return <EntryEditor onChange={onChange} onSave={onSubmit} />
    }

    return (
        <div>
            {
                entries.map((entry) => {
                    return <EntryEditor key={entry.id} entry={entry} editing={false} onChange={onChange} onSave={onSubmit} />
                })
            }
        </div>
    )
}

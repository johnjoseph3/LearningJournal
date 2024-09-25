'use client'

import { Entry } from "@prisma/client"
import ContentForm from "../content-form";

export default function EntryEditor(
    props: { entry: Entry, editing: boolean, onChange: (val: string) => void, onSave: () => void }
) {
    const { entry, editing, onChange, onSave } = props;

    if (!editing) {
        return <div className="prose">
            <div dangerouslySetInnerHTML={{ __html: entry.content }} />
        </div>
    }

    return (
        <ContentForm key={entry.id} content={entry.content} onChange={onChange} onSave={onSave} />
    )
}

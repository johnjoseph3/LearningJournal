'use client'

import { Entry } from "@prisma/client"
import ContentForm from "../content-form";
import { JSONContent } from "novel";

export default function EntryEditor(
    props: { entry: Entry, editing: boolean, onChange: (val: JSONContent) => void }
) {
    const { entry, editing, onChange } = props;

    // EITHER FIND A WAY TO PARSE JSON TO HTML OR ADJUST advanced-editor to save both html and json

    if (!editing) {

        return <div className="prose">
            {/* TODO Display entry.content */}
            <div dangerouslySetInnerHTML={{ __html: "" }} />
        </div>
    }

    return (
        <ContentForm key={entry.id} content={entry.content as JSONContent} onChange={onChange} />
    )
}

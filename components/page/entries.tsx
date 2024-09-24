'use client'

import { Entry } from "@prisma/client"
import ContentForm from "../content-form"
import EntryEditor from "../entry/entry-editor";

const initialValue = ""

export default function Entries(props: { entries: Entry[] }) {
    const { entries } = props;

    const onChange = (val: string) => {
        // TODO IMPLEMENT THIS
        console.log("val", val)
    }

    if (!entries.length) {
        return <ContentForm content={initialValue} onChange={onChange} />
    }

    return (
        <div>
            {
                entries.map((entry) => {
                    return <EntryEditor key={entry.id} entry={entry} editing={false} onChange={onChange} />
                })
            }
        </div>
    )
}

'use client'

import { Entry } from "@prisma/client"
import EntryEditor from "../entry/entry-editor";
import { JSONContent } from "novel";

export default function Entries(props: { entries: Entry[] }) {
    const { entries } = props;

    const onChange = (val: JSONContent) => {
        // TODO IMPLEMENT THIS
        console.log("val", val)
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

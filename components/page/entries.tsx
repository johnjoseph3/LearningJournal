'use client'

import { Entry } from "@prisma/client"
import ContentForm from "../content-form";
import { JSONContent } from "novel";

export default function Entries(props: { entries: Entry[] }) {
    const { entries } = props;

    const onChange = (val: JSONContent) => {
        // TODO IMPLEMENT THIS
        console.log("val", val)
    }

    return (
        <div className="prose">
            {
                entries.map((entry) => {
                    return <ContentForm key={entry.id} content={entry.content as JSONContent} onChange={onChange} />
                })
            }
            {
                <ContentForm content={{}} onChange={onChange} />
            }
        </div>
    )
}

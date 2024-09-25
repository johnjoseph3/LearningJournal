'use client'

import Editor from './editor/advanced-editor'
import { Button } from "./ui/button"

export default function ContentForm(
    props: {
        content: string,
        onChange: (value: any) => void,
        onSave: () => void
    }
) {
    const { content, onChange, onSave } = props;

    return (
        <>
            <Editor
                initialValue={content}
                onChange={onChange} />
            <Button onClick={onSave}>Save</Button>
        </>
    )
}

'use client'

import Editor from './editor/advanced-editor.tsx'
import { Button } from "./ui/button.tsx"

export default function ContentForm(
    props: {
        content: string,
        onChange: (value: string) => void,
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

'use client'

import Editor from './editor/advanced-editor'

export default function ContentForm(props: { content: string, onChange: (value: any) => void }) {
    const { content, onChange } = props;

    return (
        <Editor
            initialValue={content}
            onChange={onChange} />
    )
}

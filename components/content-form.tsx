'use client'

import { useState } from 'react';

import Editor from './editor/advanced-editor'

export default function ContentForm() {
    const [content, setContent] = useState({})

    return (
        <>
            <h1>Content form</h1>
            <Editor
                initialValue={content}
                onChange={setContent} />
        </>
    )
}

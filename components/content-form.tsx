'use client'

import { useState } from 'react';

import Editor from './editor/advanced-editor'

export default function ContentForm() {
    const [content, setContent] = useState({})

    return (
        <Editor
            initialValue={content}
            onChange={setContent} />
    )
}

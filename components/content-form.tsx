'use client'

import { useState } from 'react';

import Editor from './editor/advanced-editor'
import { JSONContent } from 'novel';

export default function ContentForm(props: { content: JSONContent, onChange: (value: any) => void }) {
    const { content, onChange } = props;

    return (
        <Editor
            initialValue={content}
            onChange={onChange} />
    )
}

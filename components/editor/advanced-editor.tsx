"use client"

import React, { useState } from "react"
import {
  EditorRoot,
  EditorCommand,
  EditorCommandItem,
  EditorCommandEmpty,
  EditorContent,
  type JSONContent,
  EditorCommandList,
  EditorBubble,
  EditorInstance
} from "novel"

import { ImageResizer, handleCommandNavigation } from "novel/extensions"
import { defaultExtensions } from "./extensions.ts"
import { NodeSelector } from "./selectors/node-selector.tsx"
import { LinkSelector } from "./selectors/link-selector.tsx"
import { ColorSelector } from "./selectors/color-selector.tsx"

import { TextButtons } from "./selectors/text-buttons.tsx"
import { slashCommand, suggestionItems } from "./slash-command.tsx"
import { handleImageDrop, handleImagePaste } from "novel/plugins"
import { uploadFn } from "./image-upload.ts"
import { Separator } from "../ui/separator.tsx"
import { useDebouncedCallback } from "use-debounce"

const extensions = [...defaultExtensions, slashCommand]

interface EditorProp {
  id: number
  initialValue?: JSONContent | undefined
  onChange: (id: number, value: JSONContent) => void
  editable?: boolean
}

const Editor = ({
  initialValue,
  onChange,
  editable = true,
  id
}: EditorProp) => {
  const [openNode, setOpenNode] = useState(false)
  const [openColor, setOpenColor] = useState(false)
  const [openLink, setOpenLink] = useState(false)

  const debouncedUpdates = useDebouncedCallback(
    async (props: { editor: EditorInstance; transaction: any }) => {
      console.log("Debounced update")
      onChange(id, props.editor.getJSON())
    },
    500
  )

  return (
    <EditorRoot>
      <EditorContent
        editable={editable}
        immediatelyRender={false}
        className={"p-4 rounded-xl"}
        {...(initialValue && { initialContent: initialValue })}
        extensions={extensions}
        editorProps={{
          handleDOMEvents: {
            keydown: (_view, event) => handleCommandNavigation(event)
          },
          handlePaste: (view, event) => handleImagePaste(view, event, uploadFn),
          handleDrop: (view, event, _slice, moved) =>
            handleImageDrop(view, event, moved, uploadFn),
          attributes: {
            class:
              "prose prose-lg dark:prose-invert prose-headings:font-title font-default focus:outline-none max-w-full"
          }
        }}
        onUpdate={debouncedUpdates}
        slotAfter={<ImageResizer />}
      >
        <EditorCommand className="z-50 h-auto max-h-[330px] overflow-y-auto rounded-md border border-muted bg-background px-1 py-2 shadow-md transition-all">
          <EditorCommandEmpty className="px-2 text-muted-foreground">
            No results
          </EditorCommandEmpty>
          <EditorCommandList>
            {suggestionItems.map((item: any) => (
              <EditorCommandItem
                value={item.title}
                onCommand={(val) => item.command?.(val)}
                className={
                  "flex w-full items-center space-x-2 rounded-md px-2 py-1 text-left text-sm hover:bg-accent aria-selected:bg-accent"
                }
                key={item.title}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-md border border-muted bg-background">
                  {item.icon}
                </div>
                <div>
                  <p className="font-medium">{item.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </EditorCommandItem>
            ))}
          </EditorCommandList>
        </EditorCommand>

        <EditorBubble
          tippyOptions={{
            placement: "top"
          }}
          className="flex w-fit max-w-[90vw] overflow-hidden rounded-md border border-muted bg-background shadow-xl"
        >
          <Separator orientation="vertical" />
          <NodeSelector open={openNode} onOpenChange={setOpenNode} />
          <Separator orientation="vertical" />

          <LinkSelector open={openLink} onOpenChange={setOpenLink} />
          <Separator orientation="vertical" />
          <TextButtons />
          <Separator orientation="vertical" />
          <ColorSelector open={openColor} onOpenChange={setOpenColor} />
        </EditorBubble>
      </EditorContent>
    </EditorRoot>
  )
}

export default Editor

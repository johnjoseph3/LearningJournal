import React, { FC } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog"
import {
  Cross1Icon,
  CheckIcon,
  Pencil1Icon,
  FilePlusIcon,
  FileMinusIcon
} from "@radix-ui/react-icons"
import { EntryData } from "./page/entries-editor"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip"

interface Item {
  id: number
}

interface SortableLinkCardProps {
  id: Item
  onDelete: (entry: EntryData) => void
  onSave: (entry: EntryData) => void
  onEdit: (entry: EntryData) => void
  onDraftToggle: (entry: EntryData) => void
  children: any
  entry: EntryData
}

const SortableLinks: FC<SortableLinkCardProps> = ({
  id,
  onSave,
  onDelete,
  onEdit,
  onDraftToggle,
  children,
  entry
}) => {
  const uniqueId = id.id
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: uniqueId })

  const sortable = !entry.blank
  const editable = entry.editable
  const draft = entry.draft

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  }

  const handleDelete = () => {
    onDelete(entry)
  }

  const handleClick = () => {
    onSave(entry)
  }

  const handleEdit = () => {
    onEdit(entry)
  }

  const handleDraftToggle = () => {
    onDraftToggle(entry)
  }

  const isCursorGrabbing = attributes["aria-pressed"]

  return (
    <div ref={setNodeRef} style={style} key={uniqueId}>
      <TooltipProvider>
        <Card
          className={`relative flex justify-between gap-5 group  ${editable ? "border-slate-400" : null}`}
        >
          <div className="min-w-0" style={{ maxWidth: "75%" }}>
            {children}
          </div>
          <div className="flex justify-center items-center gap-4 min-w-10 pr-2">
            <div className="hidden group-hover:block">
              <Dialog>
                <Tooltip>
                  <DialogTrigger>
                    <TooltipTrigger asChild>
                      <Cross1Icon className="text-destructive" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Delete entry</p>
                    </TooltipContent>
                  </DialogTrigger>
                </Tooltip>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      Are you sure you want to delete this entry?
                    </DialogTitle>
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button variant="destructive" onClick={handleDelete}>
                          Delete
                        </Button>
                      </DialogClose>
                    </DialogFooter>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            </div>
            <div className="hidden group-hover:block cursor-pointer">
              <Tooltip>
                <TooltipTrigger asChild>
                  <CheckIcon className="text-save" onClick={handleClick} />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Save entry</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <div className="hidden group-hover:block cursor-pointer">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Pencil1Icon className="text-save" onClick={handleEdit} />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Edit</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <Tooltip>
              <TooltipTrigger asChild>
                {draft ? (
                  <FilePlusIcon
                    className="hidden group-hover:block cursor-pointer"
                    onClick={handleDraftToggle}
                  />
                ) : (
                  <FileMinusIcon
                    className="hidden group-hover:block cursor-pointer"
                    onClick={handleDraftToggle}
                  />
                )}
              </TooltipTrigger>
              <TooltipContent>
                <p>{draft ? "Publish entry" : "Unpublish entry"}</p>
              </TooltipContent>
            </Tooltip>

            {sortable ? (
              <button
                {...attributes}
                {...listeners}
                className={` ${isCursorGrabbing ? "cursor-grabbing" : "cursor-grab"} hidden group-hover:block`}
                aria-describedby={`DndContext-${uniqueId}`}
              >
                <svg viewBox="0 0 20 20" width="15">
                  <path
                    d="M7 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 2zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 14zm6-8a2 2 0 1 0-.001-4.001A2 2 0 0 0 13 6zm0 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 14z"
                    fill="currentColor"
                  ></path>
                </svg>
              </button>
            ) : null}
          </div>
        </Card>
      </TooltipProvider>
    </div>
  )
}

export default SortableLinks

import React, { FC, useState } from "react"
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
  FilePlusIcon,
  FileMinusIcon,
  DotsHorizontalIcon
} from "@radix-ui/react-icons"
import { EntryData } from "./page/entries-editor"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"

interface Item {
  id: number
}

interface SortableLinkCardProps {
  id: Item
  onDelete: (entry: EntryData) => void
  onDraftToggle: (entry: EntryData) => void
  children: any
  entry: EntryData
}

const SortableLinks: FC<SortableLinkCardProps> = ({
  id,
  onDelete,
  onDraftToggle,
  children,
  entry
}) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const handleDialogTriggerClick = (event: React.MouseEvent) => {
    event.stopPropagation()
    setIsDeleteDialogOpen(true)
  }

  const handleCancelClick = (event: React.MouseEvent) => {
    event.stopPropagation()
    setIsDeleteDialogOpen(false)
  }

  const uniqueId = id.id
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: uniqueId })

  const draft = entry.draft

  const style = {
    transform: CSS.Translate.toString(transform),
    transition
  }

  const handleDelete = () => {
    onDelete(entry)
  }

  const handleDraftToggle = () => {
    onDraftToggle(entry)
  }

  const isCursorGrabbing = attributes["aria-pressed"]

  return (
    <div ref={setNodeRef} style={style} key={uniqueId}>
      <Card className="relative flex justify-between gap-5 group">
        <div className="w-full">
          {children}
        </div>

        <div className="flex justify-center items-center gap-4 min-w-10 pr-2 opacity-30 hover:opacity-100">
          <button
            {...attributes}
            {...listeners}
            className={` ${isCursorGrabbing ? "cursor-grabbing" : "cursor-grab"}`}
            aria-describedby={`DndContext-${uniqueId}`}
          >
            <svg viewBox="0 0 20 20" width="15">
              <path
                d="M7 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 2zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 14zm6-8a2 2 0 1 0-.001-4.001A2 2 0 0 0 13 6zm0 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 14z"
                fill="currentColor"
              ></path>
            </svg>
          </button>

          <div className="cursor-pointer relative ">
            <TooltipProvider>
              <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                  <DotsHorizontalIcon />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" forceMount className="min-w-0">
                  <DropdownMenuItem className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <Dialog
                        open={isDeleteDialogOpen}
                        onOpenChange={setIsDeleteDialogOpen}
                      >
                        <Tooltip>
                          <DialogTrigger asChild>
                            <TooltipTrigger asChild>
                              <div>
                                <Cross1Icon
                                  className="text-destructive cursor-pointer"
                                  onClick={handleDialogTriggerClick}
                                />
                              </div>
                            </TooltipTrigger>
                          </DialogTrigger>
                        </Tooltip>

                        <DialogContent onClick={(e) => e.stopPropagation()}>
                          <DialogHeader>
                            <DialogTitle className="mb-4">
                              Are you sure you want to delete this entry?
                            </DialogTitle>
                            <DialogFooter>
                              <DialogClose asChild>
                                <Button
                                  variant="destructive"
                                  onClick={async (event) => {
                                    await handleDelete()
                                    setIsDeleteDialogOpen(false)
                                  }}
                                >
                                  Delete
                                </Button>
                              </DialogClose>
                              <Button
                                variant="secondary"
                                onClick={handleCancelClick}
                              >
                                Cancel
                              </Button>
                            </DialogFooter>
                          </DialogHeader>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        {draft ? (
                          <FilePlusIcon
                            className="group-hover:block cursor-pointer"
                            onClick={handleDraftToggle}
                          />
                        ) : (
                          <FileMinusIcon
                            className="group-hover:block cursor-pointer"
                            onClick={handleDraftToggle}
                          />
                        )}
                      </TooltipTrigger>
                      <TooltipContent side="left">
                        <p>{draft ? "Publish" : "Unpublish"}</p>
                      </TooltipContent>
                    </Tooltip>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TooltipProvider>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default SortableLinks

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
import { Cross1Icon, CheckIcon, Pencil1Icon } from "@radix-ui/react-icons"

interface Item {
  id: number
}

interface SortableLinkCardProps {
  id: Item
  onDelete: (id: number) => void
  onSave: (id: number) => void
  onEdit: (id: number) => void
  sortable: boolean
  children: any
  editable: boolean
}

const SortableLinks: FC<SortableLinkCardProps> = ({
  id,
  onSave,
  onDelete,
  onEdit,
  sortable,
  children,
  editable
}) => {
  const uniqueId = id.id
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: uniqueId })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  }

  const handleDelete = () => {
    onDelete(uniqueId)
  }

  const handleClick = () => {
    onSave(uniqueId)
  }

  const handleEdit = () => {
    onEdit(uniqueId)
  }

  const isCursorGrabbing = attributes["aria-pressed"]

  return (
    <div ref={setNodeRef} style={style} key={uniqueId}>
      <Card
        className={`relative flex justify-between gap-5 group  ${editable ? "border-slate-400" : null}`}
      >
        <div className="min-w-0">{children}</div>
        <div className="flex justify-center items-center gap-4 min-w-10 pr-2">
          <div className="hidden group-hover:block">
            <Dialog>
              <DialogTrigger>
                <Cross1Icon className="text-destructive" />
              </DialogTrigger>
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
            <CheckIcon className="text-save" onClick={handleClick} />
          </div>
          <div className="hidden group-hover:block cursor-pointer">
            <Pencil1Icon className="text-save" onClick={handleEdit} />
          </div>
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
    </div>
  )
}

export default SortableLinks

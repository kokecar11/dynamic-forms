import React from "react"
import { useDroppable } from "@dnd-kit/core"

interface DroppableProps {
  children: React.ReactNode
  id: string
}
export function Droppable(props: DroppableProps) {
  const { setNodeRef } = useDroppable({
    id: props.id,
  })

  return (
    <div
      ref={setNodeRef}
      className="bg-slate-300 rounded-lg p-2 border border-dashed border-black"
    >
      {props.children}
    </div>
  )
}

import { PropsWithChildren } from "react";
import { useDroppable } from "@dnd-kit/core";

/**
 * A droppable container component for use with the `@dnd-kit` library.
 * This component wraps its children and allows them to act as a drop target
 * for drag-and-drop interactions.
 * @param {string} props.id - The unique identifier for the droppable container.
 * @param {"board" | "list"} props.type - The type of the droppable container, indicating whether it represents a "board" or "list".
 * @param {React.ReactNode} props.children - The child components to be rendered inside the droppable container.
 *
 */
export const DroppableContainer = ({ id, type, children }: PropsWithChildren<{ id: string; type: "board" | "list" }>) => {
  const { setNodeRef } = useDroppable({
    id,
    data: {
      type,
    },
  });

  return (
    <div ref={setNodeRef} className="h-fit">
      {children}
    </div>
  );
};

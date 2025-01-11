import { PropsWithChildren } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

/**
 * A draggable container component for use with the `@dnd-kit` library.
 * This component wraps its children and makes them draggable, supporting reordering
 * and drag-and-drop interactions.
 *
 * @param {string} props.id - The unique identifier for the draggable container.
 * @param {"list" | "task"} props.type - The type of the draggable container, indicating whether it represents a "list" or "task".
 * @param {React.ReactNode} props.children - The child components to be rendered inside the draggable container.
 *
 */
export const DraggableContainer = ({ id, type, children }: PropsWithChildren<{ id: string; type: "list" | "task" }>) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
    data: {
      type,
    },
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.3 : 1,
        cursor: "grab",
      }}
      {...attributes}
      {...listeners}
      className={`${type === "list" ? "h-fit min-h-52" : ""}`}
    >
      {children}
    </div>
  );
};

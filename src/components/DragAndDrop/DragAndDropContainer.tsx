import { useDragAndDropZone } from "@/utils/helpers/hooks/useDragAndDropZone";
import { BoardType } from "@/utils/types/boards.types";
import { ListType } from "@/utils/types/lists.types";
import { DndContext, DragOverlay, MouseSensor, useSensor, useSensors } from "@dnd-kit/core";
import { PropsWithChildren } from "react";
import { DragOverlayTask } from "./DragOverlayTask";
import { DragOverlayList } from "./DragOverlayList";
import { TaskType } from "@/utils/types/tasks.types";

/**
 * A container for managing drag-and-drop functionality for tasks and lists within a board.
 * Utilizes the `@dnd-kit` library to handle drag-and-drop interactions.
 *
 * @param {ListType[]} props.lists - An array of lists associated with the board.
 * @param {BoardType} props.board - The board object containing metadata and associated lists.
 * @param {React.ReactNode} props.children - The children components rendered inside the drag-and-drop context.
 *
 */
export const DragAndDropContainer = ({ lists, board, children }: PropsWithChildren<{ lists: ListType[]; board: BoardType }>) => {
  const { handleDragOver, handleDragEnd, handleDragStart, activeItem } = useDragAndDropZone(lists, board);

  // Configure the MouseSensor with a constraint for activation
  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 10,
    },
  });

  const sensors = useSensors(mouseSensor);

  return (
    <DndContext sensors={sensors} onDragOver={handleDragOver} onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
      {children}
      <DragOverlay>
        {activeItem &&
          (activeItem.type === "task" ? (
            <DragOverlayTask task={activeItem.item as TaskType} />
          ) : activeItem.type === "list" ? (
            <DragOverlayList list={activeItem.item as ListType} />
          ) : null)}{" "}
      </DragOverlay>
    </DndContext>
  );
};

import { DragEndEvent, DragStartEvent, DragOverEvent } from "@dnd-kit/core";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { TaskType } from "@/utils/types/tasks.types";
import { FirestoreService } from "@/utils/firebase/firestore/firestoreService";
import { ListType } from "@/utils/types/lists.types";

type DragAndDropZoneProps = {
  lists?: ListType[];
  boardId: string;
};

/**
 * Custom hook to handle drag-and-drop events for tasks.
 * This hook provides:
 * - Tracking of the active task during dragging.
 * - Managing list changes when a task is moved between lists.
 * - Sorting tasks within the same list or between multiple lists.
 * 
 * The hook uses optimistic updates, updating the UI before synchronizing the changes with Firestore.
 * 
 * @param {DragAndDropZoneProps} props - Properties containing the list of tasks and the board ID.
 * @returns Handlers for drag start, drag over, and drag end events, as well as the active task state.
 */
export const useDragAndDropZone = ({ lists, boardId }: DragAndDropZoneProps) => {
  const [activeTask, setActiveTask] = useState<TaskType | null>(null);
  const queryClient = useQueryClient();

  /**
   * Retrieves task data to display in the DragOverlay.
   * 
   * @param {string} taskId - ID of the task being dragged.
   */
  const getActiveTask = async (taskId: string) => {
    const task = await new Promise<TaskType>((resolve, reject) => {
      const unsubscribe = FirestoreService.subscribeToDocument<TaskType>(
        "tasks",
        taskId,
        (task) => {
          if (task) {
            resolve(task);
          } else {
            reject(new Error(`Task with ID ${taskId} not found`));
          }
        },
        (error) => {
          reject(new Error(`Error while getting document: ${error.message}`));
        },
      );
      return () => unsubscribe;
    });
    setActiveTask(task);
  };

  /**
   * Sets the active task for dragging.
   * 
   * @param {DragStartEvent} active - The drag start event object.
   */
  const handleDragStart = ({ active }: DragStartEvent) => {
    getActiveTask(active.id.toString());
  };

  /**
   * Handles list changes when a task is dragged over a different list.
   * 
   * @param {DragOverEvent} active - The drag over event object.
   */
  const handleDragOver = async ({ active, over }: DragOverEvent) => {
    if (!over || !lists) {
      return;
    }

    const initialContainer = active.data.current?.sortable?.containerId;
    const targetContainer = over.data.current?.sortable?.containerId;

    const targetType = over.data.current?.type;

    if (!initialContainer || initialContainer === targetContainer) {
      return;
    }

    const overId = targetContainer ? targetContainer : over.id.toString();

    const oldList = lists.find((list) => list.id === initialContainer);
    const newList = lists.find((list) => list.id === overId);

    if (oldList && newList && !newList.tasks.includes(active.id.toString())) {
      const targetIndex =
        targetType === "task"
          ? over.data.current?.sortable?.index
          : newList.tasks.length === 0
            ? 0
            : newList.tasks.length - 1;

      const sortedTask = [...newList.tasks];
      sortedTask.splice(targetIndex, 0, active.id.toString());

      const removedTask = oldList.tasks.filter(
        (taskId) => taskId !== active.id
      );

      // Optimistic update
      queryClient.setQueryData(
        ["lists", boardId],
        (oldLists: ListType[] | undefined) => {
          if (!oldLists) return oldLists;

          return oldLists.map((list) => {
            if (list.id === newList.id) {
              return { ...list, tasks: sortedTask };
            } else if (list.id === oldList.id) {
              return { ...list, tasks: removedTask };
            } else {
              return list;
            }
          });
        }
      );

      // Firestore update
      try {
        await Promise.all([
          FirestoreService.updateDocument<ListType>(
            "lists",
            { tasks: sortedTask },
            newList.id
          ),
          FirestoreService.updateDocument<ListType>(
            "lists",
            { tasks: removedTask },
            oldList.id
          ),
        ]);
      } catch (error: any) {
        queryClient.invalidateQueries({ queryKey: ["lists", boardId] });
        throw new Error(error);
      }
    }
  };

  /**
   * Handles task sorting within the same list after dragging ends.
   * 
   * @param {DragEndEvent} active - The drag end event object.
   */
  const handleDragEnd = async ({ active, over }: DragEndEvent) => {
    if (!over || !lists || !active.data.current || !over.data.current) {
      setActiveTask(null);
      return;
    }

    const initialContainer = active.data.current.sortable?.containerId;
    const targetContainer = over.data.current?.sortable?.containerId;

    if (active.id === over.id || initialContainer !== targetContainer) {
      setActiveTask(null);
      return;
    }

    setActiveTask(null);

    const targetIndex = over.data.current?.sortable?.index;
    const listToUpdate = lists.find((list) => list.id === initialContainer);

    if (listToUpdate) {
      const sortedTask = [
        ...listToUpdate.tasks.filter((id) => id !== active.id),
      ];
      sortedTask.splice(targetIndex, 0, active.id.toString());

      // Optimistic update
      queryClient.setQueryData(
        ["lists", boardId],
        (oldLists: ListType[] | undefined) => {
          if (!oldLists) return oldLists;

          return oldLists.map((list) => {
            if (list.id === listToUpdate.id) {
              return { ...list, tasks: sortedTask };
            }
            return list;
          });
        }
      );

      // Firestore update
      try {
        await FirestoreService.updateDocument<ListType>(
          "lists",
          { tasks: sortedTask },
          listToUpdate.id
        );
      } catch (error: any) {
        queryClient.invalidateQueries({ queryKey: ["lists", boardId] });
        throw new Error(error);
      }
    }
  };

  return { handleDragStart, handleDragOver, handleDragEnd, activeTask };
};

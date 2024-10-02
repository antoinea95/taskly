import { DragEndEvent, DragStartEvent, DragOverEvent } from "@dnd-kit/core";
import { useState } from "react";

import FirestoreApi from "@/firebase/FirestoreApi";
import { ListType, TaskType } from "@/utils/types";
import { useQueryClient } from "@tanstack/react-query";

interface DragAndDropZoneProps {
  lists?: ListType[];
  boardId: string;
}

export const useDragAndDropZone = ({ lists, boardId }: DragAndDropZoneProps) => {
  const [activeTask, setActiveTask] = useState<TaskType | null>(null);
  const queryClient = useQueryClient();

  /**
   * Get task data to display DragOverlay
   * @param taskId - Id of dragging task
   */
  const getActiveTask = async (taskId: string) => {
    const task = await new Promise<TaskType>((resolve, reject) => {
      const unsubscribe = FirestoreApi.subscribeToDocument<TaskType>({
        collectionName: "tasks",
        documentId: taskId,
        callback: (task) => {
          if (task) {
            resolve(task);
          } else {
            reject(new Error(`Task with ID ${taskId} not found`));
          }
        },
        errorMessage: "Error getting task",
      });
      return () => unsubscribe;
    });
    setActiveTask(task);
  };

  /**
   * Set active task and get data
   * @param active - dragging event
   */
  const handleDragStart = ({ active }: DragStartEvent) => {
    getActiveTask(active.id.toString());
  };

  /**
   * Manage list change
   */
  const handleDragOver = async ({ active, over }: DragOverEvent) => {
    if (!over || !lists) {
      return;
    }

    // List id for old and new list
    const initialContainer = active.data.current?.sortable?.containerId;
    const targetContainer = over.data.current?.sortable?.containerId;

    // If active task over an other task
    const targetType = over.data.current?.type;

    if (!initialContainer || initialContainer === targetContainer) {
      return;
    }

    // if no target container: A task is over
    const overId = targetContainer ? targetContainer : over.id.toString();

    // find lists to update
    const oldList = lists.find((list) => list.id === initialContainer);
    const newList = lists.find((list) => list.id === overId);

    if (oldList && newList && !newList.tasks.includes(active.id.toString())) {
      // handle sorting tasks in list
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

      // Firestore call
      try {
        await Promise.all([
          FirestoreApi.updateDocument<ListType>(
            "lists",
            { tasks: sortedTask },
            newList.id
          ),
          FirestoreApi.updateDocument<ListType>(
            "lists",
            { tasks: removedTask },
            oldList.id
          ),
        ]);
        queryClient.invalidateQueries({ queryKey: ["lists", boardId] });
      } catch (error: any) {
        queryClient.invalidateQueries({ queryKey: ["lists", boardId] });
        throw new Error(error);
      }
    }
  };

  /**
   *
   * Manage sorting of tasks in the same list
   * @returns
   */
  const handleDragEnd = async ({ active, over }: DragEndEvent) => {
    if (!over || !lists || !active.data.current || !over.data.current) {
      setActiveTask(null);
      return;
    }

    const initialContainer = active.data.current.sortable?.containerId;
    const targetContainer = over.data.current.sortable?.containerId;

    if (active.id === over.id || initialContainer !== targetContainer) {
      setActiveTask(null);
      return;
    }

    setActiveTask(null);

    const targetIndex = over.data.current?.sortable?.index;
    const listToUpdate = lists.find((list) => list.id === initialContainer);

    if (listToUpdate) {
      // Sorting task in list
      const sortedTask = [
        ...listToUpdate.tasks.filter((id) => id !== active.id),
      ];
      sortedTask.splice(targetIndex, 0, active.id.toString());

      // Optimistic update
      queryClient.setQueryData(
        ["lists", boardId],
        (oldLists: ListType[] | undefined) => {
          if (!oldLists) return oldLists;

          const newList = oldLists.map((list) => {
            if (list.id === listToUpdate.id) {
              return { ...list, tasks: sortedTask };
            }
            return list;
          });
          return newList;
        }
      );

      //Firestore call
      try {
        await FirestoreApi.updateDocument<ListType>(
          "lists",
          { tasks: sortedTask },
          listToUpdate.id
        );
        queryClient.invalidateQueries({ queryKey: ["lists", boardId] });
      } catch (error: any) {
        queryClient.invalidateQueries({ queryKey: ["lists", boardId] });
        throw new Error(error);
      }
    }
  };

  return { handleDragStart, handleDragOver, handleDragEnd, activeTask };
};

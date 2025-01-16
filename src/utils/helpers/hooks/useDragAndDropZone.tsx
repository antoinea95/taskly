import { FirestoreService } from "@/utils/firebase/firestore/firestoreService";
import { BoardType } from "@/utils/types/boards.types";
import { ListType } from "@/utils/types/lists.types";
import { TaskType } from "@/utils/types/tasks.types";
import { DragEndEvent, DragOverEvent, DragStartEvent } from "@dnd-kit/core";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";


/**
 * Custom hook to manage drag-and-drop functionality for tasks and lists.
 *
 * @param {ListType[]} lists - The lists associated with the current board.
 * @param {BoardType} board - The current board containing the lists.
 *
*   handleDragStart: (event: DragStartEvent) => Promise<void>,
*   handleDragOver: (event: DragOverEvent) => Promise<void>,
*   handleDragEnd: (event: DragEndEvent) => Promise<void>,
*   activeItem: { item: TaskType | ListType; type: "task" | "list" } | null
*/
export const useDragAndDropZone = (lists: ListType[], board: BoardType) => {
  const queryClient = useQueryClient();

    // State to track the currently active item being dragged.
  const [activeItem, setActiveItem] = useState<{ item: TaskType | ListType; type: "task" | "list" } | null>(null);

   /**
   * Handles the start of a drag operation.
   *
   * @param {DragStartEvent} event - The event triggered when dragging starts.
   */
  const handleDragStart = async ({ active }: DragStartEvent) => {
    const activeType = active.data.current?.type;
    console.log(active);

    if (activeType === "task") {
      const task = await FirestoreService.fetchDoc<TaskType>("tasks", active.id.toString());
      if (!task) return;
      setActiveItem({ item: task, type: "task" });
    } else {
      const list = await FirestoreService.fetchDoc<ListType>("lists", active.id.toString());
      if (!list) return;
      setActiveItem({ item: list, type: "list" });
    }
  };


   /**
   * Handles the drag-over event, updating the local React Query cache
   * and preparing the data for persistence in Firestore.
   *
   * @param {DragOverEvent} event - The event triggered when dragging over a droppable area.
   */
  const handleDragOver = async ({ active, over }: DragOverEvent) => {
    if (!over) return;

    const activeType = active.data.current?.type;
    const overType = over.data.current?.type;

    if (activeType === "task") {
      const overListId = overType === "list" ? over.id : over.data.current?.sortable?.containerId;
      const activeListId = active.data.current?.sortable?.containerId;

      // Récupérer les listes concernées
      const overList = lists.find((list) => list.id === overListId);
      const activeList = lists.find((list) => list.id === activeListId);

      // Vérification de la validité des listes
      if (!activeList || !overList) return;

      // Indices des tâches
      const overIndex = over.data.current?.sortable?.index ?? 0;
      const activeIndex = active.data.current?.sortable?.index ?? null;

      if (activeList === overList) {
        if (overIndex === null || activeIndex === null) return;

        // Reorganize tasks within the same list.
        const updatedTasks = [...activeList.tasks];
        const [movedTask] = updatedTasks.splice(activeIndex, 1);
        updatedTasks.splice(overIndex, 0, movedTask);

        queryClient.setQueryData(["lists", board.id], (previousLists?: ListType[]) => {
          if (!previousLists) return previousLists;
          return previousLists.map((list) => (list.id === activeList.id ? { ...list, tasks: updatedTasks } : list));
        });
      } else {
        if (overIndex === null) return;

         // Update tasks in both the active list and the target list.
        const updatedActiveListTasks = activeList.tasks.filter((taskId) => taskId !== active.id);

        const updatedOverListTasks = [...overList.tasks];
        updatedOverListTasks.splice(overIndex, 0, active.id.toString());

        queryClient.setQueryData(["lists", board.id], (previousLists?: ListType[]) => {
          if (!previousLists) return previousLists;
          return previousLists.map((list) => {
            if (list.id === activeList.id) {
              return { ...list, tasks: updatedActiveListTasks };
            }
            if (list.id === overList.id) {
              return { ...list, tasks: updatedOverListTasks };
            }
            return list;
          });
        });


        // Persist the changes in Firestore.
        try {
            await Promise.all([
              FirestoreService.updateDocument<ListType>("lists", { tasks: updatedOverListTasks }, overList.id),
              FirestoreService.updateDocument<ListType>("lists", { tasks: updatedActiveListTasks }, activeList.id),
            ]);
          } catch (error: any) {
            queryClient.invalidateQueries({ queryKey: ["lists", board.id] });
            throw new Error(error);
          }
      }
    }

    // Sort when the lists move
    if (activeType === "list" && overType !== "task") {
      // Find indexs
      const activeIndex = board.lists.indexOf(active.id.toString());
      const overIndex = board.lists.indexOf(over.id.toString());

      // Copy board lists to handle sort
      const sortedListsInBoard = [...board.lists];

      // Delete active elements from is
      sortedListsInBoard.splice(activeIndex, 1);

      // Insert active element
      sortedListsInBoard.splice(overIndex, 0, active.id.toString());

      queryClient.setQueryData(["board", board.id], (previousBoard?: BoardType) => {
        if (!previousBoard) return previousBoard;
        return { ...board, lists: sortedListsInBoard };
      });
    }
  };


    /**
   * Handles the end of a drag operation, finalizing updates in Firestore.
   *
   * @param {DragEndEvent} event - The event triggered when dragging ends.
   */
  const handleDragEnd = async ({ active, over }: DragEndEvent) => {
    if (!over) return;
    setActiveItem(null);

    const activeType = active.data.current?.type;
    const overType = over.data.current?.type;


    // Update lists ordrer in the board
    if (activeType === "list" && overType !== "task") {

      // Get the new board in Local query cache set in the dragover fn
      const newBoard: BoardType | undefined = queryClient.getQueryData(["board", board.id]);
      try {
        if (!newBoard) {
          queryClient.invalidateQueries({ queryKey: ["board", board.id] });
          return;
        }
        await FirestoreService.updateDocument<BoardType>("boards", { lists: newBoard.lists }, board.id);
      } catch (error) {
        queryClient.invalidateQueries({ queryKey: ["board", board.id] });
        console.error(`Error while updating the board ${board.id}`);
        throw error;
      }
    }


    // Update the tasks order in lists
    if (activeType === "task") {
      const activeListId = active.data.current?.sortable?.containerId;

      const newLists: ListType[] | undefined = queryClient.getQueryData(["lists", board.id]);
      if (!newLists) {
        queryClient.invalidateQueries({ queryKey: ["lists", board.id] });
      }

      // Get the new list in Local query cache set in the dragover fn
      const activeList = newLists?.find((list) => list.id === activeListId.toString());
      try {
        if (!activeList) {
          queryClient.invalidateQueries({ queryKey: ["lists", board.id] });
          return;
        }
        await FirestoreService.updateDocument<ListType>("lists", { tasks: activeList.tasks }, activeList.id);
      } catch (error) {
        queryClient.invalidateQueries({ queryKey: ["lists", board.id] });
        console.error(`Error while updating the list ${activeList?.id}`);
        throw error;
      }
    }
  };

  return { handleDragStart, handleDragOver, handleDragEnd, activeItem };
};

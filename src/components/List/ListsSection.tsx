import { ListCard } from "@/components/List/ListCard";
import { useGetLists, useGetTask } from "@/firebase/fetchHook";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  DragOverEvent,
  closestCorners,
  useSensors,
  useSensor,
  PointerSensor,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useState } from "react";
import { Card } from "../ui/card";
import FirestoreApi from "@/firebase/FirestoreApi";
import { ListType } from "@/utils/types";
import { useQueryClient } from "@tanstack/react-query";
import { useDragMouse } from "@/utils/useDragMouse";
import { ListSkeleton } from "../skeletons";

export const ListsSection = ({ boardId }: { boardId: string }) => {
  const { sliderRef, handleMouseDown, handleMouseLeaveOrUp, handleMouseMove } =
    useDragMouse();
  const { data: lists, isFetched } = useGetLists(boardId);

  const [activeDragTask, setActiveDragTask] = useState<string | null>(null);
  const activeTask = useGetTask(activeDragTask ?? "");
  const queryClient = useQueryClient();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  if (!isFetched) {
    return (
      <section className="overflow-x-auto flex-1 flex flex-col w-full h-96 no-scrollbar">
        <section className="flex items-start flex-nowrap mt-10 gap-8 flex-1 w-full">
          {Array.from({ length: 4 }).map((_, index) => (
            <ListSkeleton key={index} />
          ))}
        </section>
      </section>
    );
  }

  const handleDragStart = ({ active }: DragStartEvent) => {
    setActiveDragTask(active.id.toString());
  };

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
      } catch (error) {
        console.error(error);
        queryClient.invalidateQueries({ queryKey: ["lists", boardId] });
      }
    }
  };

  const handleDragEnd = async ({ active, over }: DragEndEvent) => {
    if (!over || !lists || !active.data.current || !over.data.current) {
      setActiveDragTask(null);
      return;
    }

    setActiveDragTask(null);
    const initialContainer = active.data.current.sortable?.containerId;
    const targetContainer = over.data.current.sortable?.containerId;

    if (active.id === over.id || initialContainer !== targetContainer) {
      setActiveDragTask(null);
      return;
    }

    const targetIndex = over.data.current?.sortable?.index;

    const listToUpdate = lists.find((list) => list.id === initialContainer);

    if (listToUpdate) {
      // Mise à jour optimiste
      const sortedTask = listToUpdate.tasks.filter((id) => id !== active.id);
      sortedTask.splice(targetIndex, 0, active.id.toString());

      // Mettre à jour directement le cache
      queryClient.setQueryData(
        ["lists", boardId],
        (oldLists: ListType[] | undefined) => {
          if (!oldLists) return oldLists;

          return oldLists.map((list) =>
            list.id === listToUpdate.id ? { ...list, tasks: sortedTask } : list
          );
        }
      );

      try {
        await FirestoreApi.updateDocument<ListType>(
          "lists",
          { tasks: sortedTask },
          listToUpdate.id
        );

        queryClient.invalidateQueries({ queryKey: ["lists", boardId] });
      } catch (error) {
        console.error("Erreur lors de la mise à jour des tâches :", error);

        queryClient.invalidateQueries({ queryKey: ["lists", boardId] });
      }
    }
  };

  return (
    <DndContext
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      collisionDetection={closestCorners}
      sensors={sensors}
    >
      <section
        className="overflow-x-auto flex-1 flex flex-col w-full no-scrollbar animate-fade-in"
        ref={sliderRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeaveOrUp}
        onMouseUp={handleMouseLeaveOrUp}
      >
        <section className="flex items-start flex-nowrap mt-10 gap-8 flex-1 w-full">
          {lists &&
            isFetched &&
            lists
              .sort((a, b) => a.createdAt - b.createdAt)
              .map((list) => (
                <SortableContext
                  key={list.id}
                  items={list.tasks}
                  id={list.id}
                  strategy={verticalListSortingStrategy}
                >
                  <ListCard list={list} boardId={boardId} />
                </SortableContext>
              ))}
        </section>
      </section>
      <DragOverlay>
        {activeDragTask && activeTask.data ? (
          <Card className="py-6 px-2 min-h-13 cursor-pointer shadow-none border-none">
            {activeTask.data.title}
          </Card>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

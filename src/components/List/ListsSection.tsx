import { AddList } from "@/components/List/AddList";
import { ListCard } from "@/components/List/ListCard";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/ui/loader";
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
import { CirclePlus } from "lucide-react";
import { useState } from "react";
import { Card } from "../ui/card";
import FirestoreApi from "@/firebase/FirestoreApi";
import { ListType } from "@/utils/types";
import { useQueryClient } from "@tanstack/react-query";
import { useDragMouse } from "@/utils/useDragMouse";

export const ListsSection = ({ boardId }: { boardId: string }) => {
  const { sliderRef, handleMouseDown, handleMouseLeaveOrUp, handleMouseMove } =
    useDragMouse();
  const { data: lists, isLoading, isError } = useGetLists(boardId);
  const [isAddList, setIsAddList] = useState(false);
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

  if (isLoading) {
    return (
      <section className="overflow-x-auto border">
        <Loader data={{ color: "black", size: "4rem" }} />
      </section>
    );
  }

  if (isError) {
    return (
      <section className="overflow-x-auto border">
        <h1>Error during fetch</h1>
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

      // Mise à jour optimiste des listes
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
        // Effectuer les requêtes Firestore en parallèle
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

        // Invalider les données pour recharger les dernières infos du serveur
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

      // Mise à jour Firestore en arrière-plan
      try {
        await FirestoreApi.updateDocument<ListType>(
          "lists",
          { tasks: sortedTask },
          listToUpdate.id
        );

        // Rafraîchir les données après la mise à jour
        queryClient.invalidateQueries({ queryKey: ["lists", boardId] });
      } catch (error) {
        console.error("Erreur lors de la mise à jour des tâches :", error);

        // Si une erreur se produit, annuler la mise à jour optimiste
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
        className="overflow-x-auto h-screen"
        ref={sliderRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeaveOrUp}
        onMouseUp={handleMouseLeaveOrUp}
      >
        <section className="flex items-start flex-nowrap py-10 px-3 gap-5">
          {lists &&
            lists.map((list) => (
              <SortableContext
                key={list.id}
                items={list.tasks}
                id={list.id}
                strategy={verticalListSortingStrategy}
              >
                <ListCard list={list} boardId={boardId} />
              </SortableContext>
            ))}
          <section className="flex-1 min-w-72">
            {!isAddList ? (
              <Button onClick={() => setIsAddList(true)} className="w-full">
                <CirclePlus
                  size={18}
                  color="white"
                  strokeWidth={2}
                  className="mr-1"
                />
                Add a list
              </Button>
            ) : (
              <AddList boardId={boardId} setIsAddList={setIsAddList} />
            )}
          </section>
        </section>
      </section>
      <DragOverlay>
        {activeDragTask && activeTask.data ? (
          <Card className="py-3 px-2 min-h-12 cursor-pointer">
            {activeTask.data.title}
          </Card>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

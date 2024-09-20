import { AddList } from "@/components/List/AddList";
import { ListCard } from "@/components/List/ListCard";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/ui/loader";
import { useGetLists } from "@/firebase/fetchHook";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  DragOverEvent,
  closestCorners,
} from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";
import { CirclePlus } from "lucide-react";
import { useState } from "react";
import { Card } from "../ui/card";
import FirestoreApi from "@/firebase/FirestoreApi";
import { ListType } from "@/utils/types";
import { useQueryClient } from "@tanstack/react-query";

export const ListsSection = ({ boardId }: { boardId: string }) => {
  const { data: lists, isLoading, isError } = useGetLists(boardId);
  const [isAddList, setIsAddList] = useState(false);
  const [activeDragTask, setActiveDragTask] = useState<string | null>(null);
  const queryClient = useQueryClient();

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

  const handleDragOver = ({ active, over }: DragOverEvent) => {
    if (!over || !lists) return;

    const initialContainer = active.data.current?.sortable?.containerId;
    const targetContainer = over.data.current?.sortable?.containerId;
    const targetType = over.data.current?.type



    if (!initialContainer || initialContainer === targetContainer) return;
    console.log(initialContainer, targetContainer);


    const overId = targetContainer ? targetContainer : over.id.toString();


    const oldList = lists.find((list) => list.id === initialContainer);
    const newList = lists.find((list) => list.id === overId);

    if (oldList && newList && !newList.tasks.includes(active.id.toString())) {

      const targetIndex = targetType === "task"
      ? over.data.current?.sortable?.index
      : newList.tasks.length === 0 ? 0 : newList.tasks.length - 1;

      const sortedTask = [...newList.tasks]
      sortedTask.splice(targetIndex, 0, active.id.toString());

      const removedTask = oldList.tasks.filter((taskId) => taskId !== active.id)
      console.log("execution");

      Promise.all([
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

      // Invalider le cache pour recharger les données à jour
      queryClient.invalidateQueries({ queryKey: ["lists", boardId]});
    }
  };

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over || !lists|| !active.data.current || !over.data.current) return;
    const initialContainer = active.data.current.sortable?.containerId;
    const targetContainer = over.data.current.sortable?.containerId;

    if (active.id === over.id) return;

    if (initialContainer !== targetContainer) return;

    console.log(targetContainer);
    const targetIndex = over.data.current?.sortable?.index;

    const listToUpdate = lists.find((list) => list.id === initialContainer);

    if(listToUpdate) {

      const sortedTask = listToUpdate.tasks.filter((id) => id !== active.id);
      sortedTask.splice(targetIndex, 0, active.id.toString())

      FirestoreApi.updateDocument<ListType>(
        "lists",
        { tasks: sortedTask },
        listToUpdate.id
      )

      queryClient.invalidateQueries({ queryKey: ["lists", boardId] });
    }

    setActiveDragTask(null);

  };

  return (
    <DndContext
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      collisionDetection={closestCorners}
    >
      <section className="overflow-x-auto border-2 border-green-300">
        <section className="flex items-start flex-nowrap py-10 px-3 gap-5">
          {lists &&
            lists.map((list) => (
              <SortableContext key={list.id} items={list.tasks} id={list.id}>
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
        {activeDragTask ? (
          <Card className="py-3 px-2 min-h-12 cursor-pointer">
          </Card>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

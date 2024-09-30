import { ListCard } from "@/components/List/ListCard";
import { useGetLists } from "@/firebase/fetchHook";
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
import { ListType, TaskType } from "@/utils/types";
import { useQueryClient } from "@tanstack/react-query";
import { useDragMouse } from "@/utils/useDragMouse";
import { ListSectionSkeleton } from "../skeletons";
import { AddItem } from "../Form/AddItem";
import { useAddDoc } from "@/firebase/mutateHook";

export const ListsSection = ({ boardId }: { boardId: string }) => {
  const { sliderRef, handleMouseDown, handleMouseLeaveOrUp, handleMouseMove } =
    useDragMouse();
  const { data: lists, isFetched } = useGetLists(boardId);
  const [isAddList, setIsAddList] = useState(false);

  const [activeTask, setActiveTask] = useState<TaskType | null>(null);
  const queryClient = useQueryClient();

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

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = ({ active }: DragStartEvent) => {
    getActiveTask(active.id.toString());
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
      } catch (error: any) {
        queryClient.invalidateQueries({ queryKey: ["lists", boardId] });
        throw new Error(error);
      }
    }
  };

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
      // Mise à jour optimiste
      const sortedTask = [
        ...listToUpdate.tasks.filter((id) => id !== active.id),
      ];
      sortedTask.splice(targetIndex, 0, active.id.toString());

      // Mettre à jour directement le cache
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

  const createList = useAddDoc<ListType>("lists", "lists", boardId);

  const onSubmit = async (data: {title: string}) => {
    createList.mutate(
      {
        ...data,
        createdAt: Date.now(),
        tasks: [],
        boardId: boardId,
      },
      {
        onSuccess: () => {
          setIsAddList(false);
        },
      }
    );
  };

  if(!isFetched) {
    return <ListSectionSkeleton />
  }

  return (
    <DndContext
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      collisionDetection={closestCorners}
      sensors={sensors}
    >
      <section
        className="overflow-x-auto flex-1 flex flex-col w-full no-scrollbar"
        ref={sliderRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeaveOrUp}
        onMouseUp={handleMouseLeaveOrUp}
      >
        <section className="flex items-start flex-nowrap mt-10 gap-8 flex-1 w-full">
          {lists && isFetched && lists
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
            <div className="mt-12 justify-end min-w-72">
            <AddItem 
            type="List"
            onSubmit={onSubmit}
            query={createList}
            isOpen={isAddList}
            setIsOpen={setIsAddList}
            />
            </div>
            
        </section>
      </section>
      <DragOverlay>
        {activeTask ? (
          <Card className="py-6 px-2 min-h-13 shadow-none border-none cursor-grabbing">
            {activeTask.title}
          </Card>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

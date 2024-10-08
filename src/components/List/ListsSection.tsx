import { ListCard } from "@/components/List/ListCard";
import { useGetLists } from "@/firebase/fetchHook";
import {
  DndContext,
  DragOverlay,
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
import { ListType } from "@/utils/types";
import { useDragMouse } from "@/utils/useDragMouse";
import { ListSectionSkeleton } from "../skeletons";
import { AddItem } from "../Form/AddItem";
import { useAddDoc } from "@/firebase/mutateHook";
import { useDragAndDropZone } from "./useDragAndDropZone";

export const ListsSection = ({ boardId }: { boardId: string }) => {
  const { sliderRef, handleMouseDown, handleMouseLeaveOrUp, handleMouseMove } = useDragMouse();
  const { data: lists, isFetched } = useGetLists(boardId);
  const createList = useAddDoc<ListType>("lists", "lists", boardId);
  const [isAddList, setIsAddList] = useState(false);
  const {handleDragStart, handleDragOver, handleDragEnd, activeTask} = useDragAndDropZone({lists: lists, boardId: boardId})

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );
  

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
            <div className="min-w-72">
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

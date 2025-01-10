import { ListCard } from "@/components/List/ListCard";
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
import { useMemo, useState } from "react";
import { Card } from "../ui/card";
import { ListType } from "@/utils/types/lists.types";
import { useDragMouse } from "@/utils/helpers/hooks/useDragMouse";
import { useDragAndDropZone } from "../../utils/helpers/hooks/useDragAndDropZone";
import { useGetLists } from "@/utils/hooks/FirestoreHooks/queries/useGetLists";
import { useAddDoc } from "@/utils/hooks/FirestoreHooks/mutations/useAddDoc";
import { AddForm } from "../Form/AddForm";
import { FieldValues } from "react-hook-form";
import { SearchBar } from "../Filters/SearchBar";
import { useGetAllTasks } from "@/utils/hooks/FirestoreHooks/queries/useGetTasks";

/**
 * ListsSection component
 *
 * This component renders a section containing a sortable, drag-and-drop enabled list of cards (representing lists).
 * It fetches the lists associated with a specific board, and allows creating new lists.
 *
 * @param   props - The props for the component.
 * @param {string} props.boardId - The ID of the board for which the lists are being displayed.
 *
 * @returns A JSX element containing a draggable list of cards, with the ability to add new lists.
 */
export const ListsSection = ({ boardId }: { boardId: string }) => {
  // Setup for drag-and-drop mouse interactions
  const { sliderRef, handleMouseDown, handleMouseLeaveOrUp, handleMouseMove } = useDragMouse();

  // Fetch the lists associated with the board
  const { data: lists, isFetched } = useGetLists(boardId);
  const { data: tasks} = useGetAllTasks();

  const [searchValue, setSearchValue] = useState("");
  
  const filteredTasks = useMemo(() => {
    if (!tasks) return [];
    if (!searchValue) return tasks;
    return tasks.filter(task => task.title.toLowerCase().includes(searchValue.toLowerCase()));
  }, [searchValue, tasks]);


  // Mutation to create a new list
  const createList = useAddDoc<ListType>(["lists", boardId], "lists");

  // State to control whether the "Add List" form is visible
  const [isAddList, setIsAddList] = useState(false);

  // Drag-and-drop handlers
  const { handleDragStart, handleDragOver, handleDragEnd, activeTask } = useDragAndDropZone({ lists, boardId });

  // Setup sensors for the drag-and-drop context
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  /**
   * Handles the creation of a new list.
   *
   * @param {FieldValues} data - The data submitted from the form, containing the title of the new list.
   */
  const handleCreateList = async (data: FieldValues) => {
    createList.mutate(
      {
        title: data.title,
        createdAt: Date.now(),
        tasks: [],
        boardId,
      },
      {
        onSuccess: () => {
          setIsAddList(false); // Close the "Add List" form upon success
        },
      }
    );
  };

  if(!isFetched) {
    return null;
  }


  return (

    <>
    <SearchBar handleFilteredTasks={(e) => setSearchValue(e.target.value)} />
        <DndContext
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      collisionDetection={closestCorners}
      sensors={sensors}
    >
      <section
        className="overflow-x-auto flex-1 flex flex-col w-full no-scrollbar mb-10"
        ref={sliderRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeaveOrUp}
        onMouseUp={handleMouseLeaveOrUp}
      >
        <section className="flex items-start flex-nowrap mt-10 gap-5 flex-1">
          {lists &&
            lists
              .sort((a, b) => a.createdAt - b.createdAt)
              .map((list) => (
                <SortableContext
                  key={list.id}
                  items={list.tasks}
                  id={list.id}
                  strategy={verticalListSortingStrategy}
                >
                <ListCard list={list} boardId={boardId} tasks={filteredTasks.filter(task => list.tasks.includes(task.id))} />
                </SortableContext>
              ))}
          <div className="min-w-72">
            <AddForm
              name="List"
              onSubmit={handleCreateList}
              mutationQuery={createList}
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
    </>

  );
};

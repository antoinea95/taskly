import { ListCard } from "@/components/List/ListCard";
import { useState } from "react";
import { ListType } from "@/utils/types/lists.types";
import { useGetLists } from "@/utils/hooks/FirestoreHooks/queries/useGetLists";
import { useAddDoc } from "@/utils/hooks/FirestoreHooks/mutations/useAddDoc";
import { AddForm } from "../Form/AddForm";
import { FieldValues } from "react-hook-form";
import { DragAndDropContainer } from "../DragAndDrop/DragAndDropContainer";
import { horizontalListSortingStrategy, SortableContext } from "@dnd-kit/sortable";
import { DraggableContainer } from "../DragAndDrop/DraggableContainer";
import { useUpdateDoc } from "@/utils/hooks/FirestoreHooks/mutations/useUpdateDoc";
import { BoardType } from "@/utils/types/boards.types";
import { useDragMouse } from "@/utils/helpers/hooks/useDragMouse";

/**
 * ListsSection component
 *
 * This component renders a section containing a sortable, drag-and-drop enabled list of cards (representing lists).
 * It fetches the lists associated with a specific board, and allows creating new lists.
 *
 * @param {string} props.board - The board for which the lists are being displayed.
 *
 * @returns A JSX element containing a draggable list of cards, with the ability to add new lists.
 */
export const ListsSection = ({ board }: { board: BoardType }) => {
  // Fetch the lists associated with the board
  const { data: lists, isFetched } = useGetLists(board.id);
  const { sliderRef, handleMouseDown, handleMouseLeaveOrUp, handleMouseMove } = useDragMouse();

  // Mutation to create a new list
  const createList = useAddDoc<ListType>(["lists", board.id], "lists");
  const updateBoard = useUpdateDoc<Partial<BoardType>>(["board", board.id], "boards", board.id);

  // State to control whether the "Add List" form is visible
  const [isAddList, setIsAddList] = useState(false);

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
        boardId: board.id,
      },
      {
        onSuccess: (newListId) => {
          updateBoard.mutate({
            lists: [...board.lists, newListId],
          });
          setIsAddList(false); // Close the "Add List" form upon success
        },
      }
    );
  };

  if (!isFetched || !lists) {
    return null;
  }

  return (
    <DragAndDropContainer lists={lists} board={board}>
      <section
        className="overflow-x-auto flex flex-col w-full no-scrollbar mt-10"
        ref={sliderRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeaveOrUp}
        onMouseUp={handleMouseLeaveOrUp}
      >
        <SortableContext items={lists.map((list) => list.id)} strategy={horizontalListSortingStrategy}>
            <section className="flex gap-5">
              {lists
                .sort((a, b) => board.lists.indexOf(a.id) - board.lists.indexOf(b.id))
                .map((list) => (
                  <DraggableContainer id={list.id} type="list" key={list.id}>
                    <ListCard list={list} boardId={board.id} />
                  </DraggableContainer>
                ))}
              <div className="min-w-72">
                <AddForm name="List" onSubmit={handleCreateList} mutationQuery={createList} isOpen={isAddList} setIsOpen={setIsAddList} />
              </div>
            </section>
        </SortableContext>
      </section>
    </DragAndDropContainer>
  );
};

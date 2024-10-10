import { BoardType, ListType, UserType } from "@/utils/types";
import { useState } from "react";
import { AddForm } from "../Form/AddForm";
import { FieldValues } from "react-hook-form";
import { useAddDoc } from "@/utils/hooks/FirestoreHooks/mutations/useAddDoc";

export const AddBoard = ({user} : {user: UserType | null}) => {

  // Call mutate hooks 
  const createBoard = useAddDoc<BoardType>(["boards"], "boards");
  const createList = useAddDoc<ListType>(["lists"], "lists");

  // Toggle state
  const [isAddBoard, setIsAddBoard] = useState(false);


  /**
   * Submit function for react-hook-form
   * @param data : form value: title input
   */
  const onSubmit = async (data: FieldValues) => {
    const now = Date.now();
    if (user) {
      createBoard.mutate(
        {
          title: data.title,
          members: [user.id],
          creator: user.id,
          createdAt: now,
        },
        {
          onSuccess: async (boardId) => {
            setIsAddBoard(false);

            // Create default list: "To do", "In progress", "Finish"
            const defaultLists: Omit<ListType, "id">[] = [
              { title: "To do", createdAt: now, boardId: boardId, tasks: [] },
              {
                title: "In progress",
                createdAt: now + 1,
                boardId: boardId,
                tasks: [],
              },
              {
                title: "Finish",
                createdAt: now + 2,
                boardId: boardId,
                tasks: [],
              },
            ];

            await Promise.all(
              defaultLists.map((list) =>
                createList.mutate(list, {
                  onError: (error) => {
                    console.error(`Failed to create list ${list.title}:`, error);
                  },
                })
              )
            );
          },
        }
      );
    }
  };

  return (
      <AddForm
        name="Board"
        onSubmit={onSubmit}
        mutationQuery={createBoard}
        isOpen={isAddBoard}
        setIsOpen={setIsAddBoard}
      />
  );
};

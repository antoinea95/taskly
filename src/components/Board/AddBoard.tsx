import { BoardType, ListType } from "@/utils/types";
import { useAuth } from "@/firebase/authHook";
import { useState } from "react";
import { useAddDoc } from "@/firebase/mutateHook";
import { AddItem } from "../Form/AddItem";

export const AddBoard = () => {

  const { currentUser } = useAuth();
  const createBoard = useAddDoc<BoardType>("boards", "boards");
  const createList = useAddDoc<ListType>("boards", "lists");
  const [isAddBoard, setIsAddBoard] = useState(false);

  const onSubmit = async (data: {title: string}) => {
    if (currentUser) {
      createBoard.mutate(
        {
          ...data,
          members: [currentUser.id],
          creator: currentUser.id,
          createdAt: Date.now(),
        },
        {
          onSuccess: async (boardId) => {
            setIsAddBoard(false);
            const now = Date.now();
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
              defaultLists.map((list) => createList.mutate(list))
            );
          },
        }
      );
    }
  };

  return (
      <AddItem
        type="Board"
        onSubmit={onSubmit}
        query={createBoard}
        isOpen={isAddBoard}
        setIsOpen={setIsAddBoard}
      />
  );
};

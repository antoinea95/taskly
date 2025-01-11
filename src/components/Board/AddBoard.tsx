import { BoardType } from "@/utils/types/boards.types";
import { ListType } from "../../utils/types/lists.types";
import { UserType } from "../../utils/types/auth.types";
import { useState } from "react";
import { AddForm } from "../Form/AddForm";
import { FieldValues } from "react-hook-form";
import { useAddDoc } from "@/utils/hooks/FirestoreHooks/mutations/useAddDoc";
import { FirestoreService } from "@/utils/firebase/firestore/firestoreService"; // Service Firestore

export const AddBoard = ({ user }: { user: UserType | null }) => {
  const createBoard = useAddDoc<BoardType>(["boards"], "boards");
  const createList = useAddDoc<ListType>(["lists"], "lists");

  const [isAddBoard, setIsAddBoard] = useState(false);

  const onSubmit = async (data: FieldValues) => {
    const now = Date.now();

    if (user) {
      createBoard.mutate(
        {
          title: data.title,
          lists: [], // Initialement vide
          members: [user.id],
          creator: user.id,
          createdAt: now,
        },
        {
          onSuccess: async (boardId) => {
            setIsAddBoard(false);

            const defaultLists: Omit<ListType, "id">[] = [
              { title: "To do", createdAt: now, boardId: boardId, tasks: [] },
              {
                title: "In progress",
                createdAt: now + 1,
                boardId: boardId,
                tasks: [],
              },
              {
                title: "Finished",
                createdAt: now + 2,
                boardId: boardId,
                tasks: [],
              },
            ];

            try {

              // Created lists documents
              const createdListIds: string[] = [];
              for (const list of defaultLists) {
                try {
                  const listId = await new Promise<string>((resolve, reject) => {
                    createList.mutate(list, {
                      onSuccess: (id) => resolve(id),
                      onError: (error) => reject(error),
                    });
                  });
                  console.log(`List created: ${listId}`);
                  createdListIds.push(listId);
                } catch (error) {
                  console.error(`Failed to create list "${list.title}":`, error);
                }
              }
          
              // Update the board with the lists Ids to keep track position
              await FirestoreService.updateDocument(
                "boards",
                { lists: createdListIds },
                boardId
              );


            } catch (error) {
              console.error(
                "Error while creating lists or updating the board:",
                error
              );
            }
          },
          onError: (error) => {
            console.error("Failed to create board:", error);
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

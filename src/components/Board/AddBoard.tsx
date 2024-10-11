import { BoardType } from "@/components/types/boards.types";
import { ListType } from "../types/lists.types";
import { UserType } from "../types/auth.types";
import { useState } from "react";
import { AddForm } from "../Form/AddForm";
import { FieldValues } from "react-hook-form";
import { useAddDoc } from "@/utils/hooks/FirestoreHooks/mutations/useAddDoc";

/**
 * AddBoard component handles the creation of a new board and its default lists.
 * It manages the form submission and uses Firestore mutation hooks to add a board
 * and associated default lists ("To do", "In progress", "Finish").
 *
 * @param props - Component props.
 * @param {UserType | null} props.user - The current logged-in user who is creating the board.
 *
 * @returns The AddBoard component.
 */
export const AddBoard = ({ user }: { user: UserType | null }) => {
  // Call mutate hooks for adding boards and lists to Firestore
  const createBoard = useAddDoc<BoardType>(["boards"], "boards");
  const createList = useAddDoc<ListType>(["lists"], "lists");

  // State to toggle the visibility of the Add Board form
  const [isAddBoard, setIsAddBoard] = useState(false);

  /**
   * Form submit handler for creating a new board.
   * If the board is successfully created, it also creates default lists for the board.
   *
   * @param data - The form data submitted, typically contains the board title.
   * @returns A promise that resolves after the board and lists are created.
   */
  const onSubmit = async (data: FieldValues) => {
    const now = Date.now();

    // Ensure a user is logged in before creating the board
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
            setIsAddBoard(false); // Close the form once the board is created

            // Default lists to create for the new board
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

            // Create each default list
            await Promise.all(
              defaultLists.map((list) =>
                createList.mutate(list, {
                  onError: (error) => {
                    console.error(
                      `Failed to create list ${list.title}:`,
                      error
                    );
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

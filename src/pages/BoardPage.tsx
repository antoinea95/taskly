import { BoardType } from "@/utils/types/boards.types";
import { useNavigate, useParams } from "react-router-dom";
import { ListsSection } from "../components/List/ListsSection";
import { UpdateTitleForm } from "@/components/Form/UpdateTitleForm";
import { AddMember } from "@/components/Members/AddMember";
import { MembersDetails } from "@/components/Members/MembersDetails";
import { useGetDoc } from "@/utils/hooks/FirestoreHooks/queries/useGetDoc";
import { useUpdateDoc } from "@/utils/hooks/FirestoreHooks/mutations/useUpdateDoc";
import { useDeleteBoard } from "@/utils/hooks/FirestoreHooks/mutations/useDeletions";
import { useAuth } from "@/utils/hooks/FirestoreHooks/auth/useAuth";
import { DeleteButton } from "@/components/Button/DeleteButton";
import { DeleteConfirmation } from "@/components/Form/actions/DeleteConfirmation";
import PageTitle from "@/routes/PageTitle";
import { BoardContextProvider } from "@/utils/helpers/context/BoardContext";

/**
 * BoardPage component
 *
 * This component renders the details of a specific board, including the ability to update its title,
 * add/remove members, and delete the board if the current user is the creator.
 *
 * @returns A page displaying the board and its lists, with actions for updating and managing members.
 */
export const BoardPage = () => {
  const { boardId } = useParams<{ boardId?: string }>();
  const { currentUser } = useAuth();
  const naviagate = useNavigate();

  const { data: board, isFetched, isError } = useGetDoc<BoardType>("boards", boardId);
  const deleteBoard = useDeleteBoard<void>(currentUser?.id, boardId);
  const updateBoard = useUpdateDoc<BoardType>(
    ["board", boardId],
    "boards",
    boardId
  );

  if(isError && isFetched) {
    return <div className="h-full flex items-center justify-center animate-fade-in">
      <h1 className="text-4xl uppercase text-gray-300 dark:text-gray-600">Board not found</h1>
    </div>
  }
  

  /**
   * Handles the deletion of the current board.
   * Once deleted, the user is redirected to the home page.
   */
  const handleDeleteBoard = async () => {
    await deleteBoard.mutateAsync();
    naviagate("/");
  };

  if (!boardId || !isFetched) {
    return null;
  }

  return (
    <main className="flex flex-col">
      {board && isFetched && (
        <BoardContextProvider boardId={board.id}>
          <PageTitle title={`Taskly: ${board.title}`} />
          <header className="flex justify-between items-center flex-wrap animate-top-to-bottom">
            {/* Form to update the board title */}
            <UpdateTitleForm
              title={board.title}
              name="Board"
              mutationQuery={updateBoard}
              headingLevel={"h1"}
            />
            <div className="flex flex-col md:flex-row items-start gap-3 pl-3 md:h-10 mt-3 w-full md:w-fit">
                {/* Display member details and allow updating members */}
                <MembersDetails
                  members={board.members}
                  creator={board.creator}
                  mutationQuery={updateBoard}
                  isBoard
                />
              {board.creator === currentUser?.id && (
                <AddMember
                  queryKey={["boards", board.creator]}
                  mutationQuery={updateBoard}
                  members={board.members}
                />
              )}
              {/* Show the delete button only if the current user is the creator */}
              {board.creator === currentUser?.id && (
                <DeleteButton content="Delete board">
                  {({ setIsOpen }) => (
                    <DeleteConfirmation
                      actionName="board"
                      handleDelete={handleDeleteBoard}
                      isPending={deleteBoard.isPending}
                      setIsOpen={setIsOpen}
                    />
                  )}
                </DeleteButton>
              )}
            </div>
          </header>
          {/* Display lists associated with the board */}
          <ListsSection board={board} />
        </BoardContextProvider>
      )}
    </main>
  );
};

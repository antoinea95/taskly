import { useGetDoc } from "@/firebase/fetchHook";
import { BoardType } from "@/utils/types";
import { useNavigate, useParams } from "react-router-dom";
import { ListsSection } from "../components/List/ListsSection";
import { BoardPageSkeleton } from "@/components/skeletons";
import { useFirestoreMutation, useUpdateDoc } from "@/firebase/mutateHook";
import FirestoreApi from "@/firebase/FirestoreApi";
import { DeleteItem } from "@/components/Form/DeleteItem";
import { UpdateTitle } from "@/components/Form/UpdateTitle";
import { BoardMembers } from "@/components/Board/BoardMembers";

export const BoardPage = () => {
  const { boardId } = useParams<{ boardId?: string }>();
  const naviagate = useNavigate();
  const { data: board, isFetched } = useGetDoc<BoardType>(
    "boards",
    boardId ?? ""
  );

  const deleteBoard = useFirestoreMutation<string[]>(
    () => FirestoreApi.deleteBoard(boardId ?? ""),
    ["boards"]
  );

  const updateBoard = useUpdateDoc<BoardType>("board", "boards", boardId ?? "");

  if (!boardId || !isFetched) {
    return <BoardPageSkeleton />;
  }

  const handleDelete = async () => {
    deleteBoard.mutate([], {
      onSuccess: () => naviagate("/"),
    });
  };

  return (
    <main className="flex-1 flex flex-col">
      {board && isFetched && (
        <>
          <header className="flex justify-between items-center">
            <UpdateTitle
              title={board.title}
              name="Board"
              query={updateBoard}
              headingLevel={"h1"}
            />
            <div className="flex items-center gap-2">
              <BoardMembers board={board} />
              <DeleteItem
                name="board"
                handleDelete={handleDelete}
                isText={false}
                isPending={deleteBoard.isPending}
              />
            </div>
          </header>
          <ListsSection boardId={boardId} />
        </>
      )}
    </main>
  );
};

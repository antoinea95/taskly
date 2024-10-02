import { useGetDoc } from "@/firebase/fetchHook";
import { BoardType } from "@/utils/types";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ListsSection } from "../components/List/ListsSection";
import { BoardPageSkeleton } from "@/components/skeletons";
import { useFirestoreMutation } from "@/firebase/mutateHook";
import FirestoreApi from "@/firebase/FirestoreApi";
import { DeleteItem } from "@/components/Form/DeleteItem";

export const BoardPage = () => {
  const { boardId } = useParams<{ boardId?: string }>();
  const naviagate = useNavigate();
  const { data: board, isFetched } = useGetDoc<BoardType>(
    "boards",
    boardId ?? ""
  );

  const [isBoardTitleUpdate, setIsBoardTitleUpdate] = useState(false);

  const deleteBoard = useFirestoreMutation<string[]>(
    () => FirestoreApi.deleteBoard(boardId ?? ""),
    ["boards"]
  )

  const handleCloseInput = () => {
    if (isBoardTitleUpdate) {
      setIsBoardTitleUpdate(false);
    }
  };

  if (!boardId || !isFetched) {
    return <BoardPageSkeleton />;
  }

  const handleDelete = async () => {
    deleteBoard.mutate([], {
      onSuccess: () => naviagate("/")
    });
  }

  return (
    <main className="flex-1 flex flex-col" onClick={handleCloseInput}>
      {board && isFetched && (
        <>
          <header className="flex justify-between items-center">
            <h1 className="text-5xl uppercase">{board?.title}</h1>
            <DeleteItem name="board" handleDelete={handleDelete} isText={false} isPending={deleteBoard.isPending} />
            </header>
          <ListsSection boardId={boardId} />
        </>
      )}
    </main>
  );
};

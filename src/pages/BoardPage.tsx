import { useGetDoc } from "@/firebase/fetchHook";
import { BoardType } from "@/utils/types";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { ListsSection } from "../components/List/ListsSection";
import { AddList } from "@/components/List/AddList";
import { Button } from "@/components/ui/button";
import { CirclePlus } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { BoardSkeleton } from "@/components/skeletons";

export const BoardPage = () => {
  const { boardId } = useParams<{ boardId?: string }>();
  const [isAddList, setIsAddList] = useState(false);
  const board = useGetDoc<BoardType>("boards", boardId);

  const [isBoardTitleUpdate, setIsBoardTitleUpdate] = useState(false);

  const handleCloseInput = () => {
    if (isBoardTitleUpdate) {
      setIsBoardTitleUpdate(false);
    }
  };

  if (board.isError) {
    return (
      <main className="p-10 flex justify-center items-start">
        <h1>
          Failed to load board data: {board.error?.message || "Unknown error"}
        </h1>
      </main>
    );
  }

  if (!board.data && board.isFetched) {
    return (
      <main className="p-10 flex justify-center items-start">
        <h1>Board not found</h1>
      </main>
    );
  }

  if (!board.isFetched) {
    return (
        <BoardSkeleton />
    );
  }

  return (
    <main className="flex-1 flex flex-col" onClick={handleCloseInput}>
      {board.data && (
        <>
          <header className="flex justify-between items-center animate-fade-in">
            <h1 className="text-5xl uppercase w-fit">{board.data.title}</h1>
            <Modal
              dialogName={`${board.data.title}: new list`}
              setIsModalOpen={setIsAddList}
              isModalOpen={isAddList}
            >
              <Button
                onClick={() => setIsAddList(true)}
                className="flex justify-start items-center gap-2 p-5 rounded-xl text-base"
              >
                <CirclePlus
                  size={18}
                  color="white"
                  strokeWidth={2}
                  className="mr-1"
                />
                Add a list
              </Button>
              <AddList boardId={board.data.id} setIsAddList={setIsAddList} />
            </Modal>
          </header>
            <ListsSection boardId={board.data.id} />
        </>
      )}
    </main>
  );
};

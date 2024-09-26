import { useGetDoc } from "@/firebase/fetchHook";
import { BoardType } from "@/utils/types";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { ListsSection } from "../components/List/ListsSection";
import { AddList } from "@/components/List/AddList";
import { Button } from "@/components/ui/button";
import { CirclePlus } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { BoardPageSkeleton } from "@/components/skeletons";

export const BoardPage = () => {
  const { boardId } = useParams<{ boardId?: string }>();
  const [isAddList, setIsAddList] = useState(false);
  const { data: board, isFetched } = useGetDoc<BoardType>(
    "boards",
    boardId ?? ""
  );

  const [isBoardTitleUpdate, setIsBoardTitleUpdate] = useState(false);

  const handleCloseInput = () => {
    if (isBoardTitleUpdate) {
      setIsBoardTitleUpdate(false);
    }
  };

  if (!boardId || !isFetched) {
    return <BoardPageSkeleton />;
  }

  return (
    <main className="flex-1 flex flex-col" onClick={handleCloseInput}>
      {board && isFetched && (
        <>
          <header className="flex justify-between items-center">
            <h1 className="text-5xl uppercase w-fit">{board?.title}</h1>
            <Modal
              dialogName={`${board?.title}: new list`}
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
              <AddList boardId={boardId} setIsAddList={setIsAddList} />
            </Modal>
          </header>
          <ListsSection boardId={boardId} />
        </>
      )}
    </main>
  );
};

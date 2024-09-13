import { BoardForm } from "@/components/Board/BoardForm";
import { AddList } from "@/components/List/AddList";
import { ListCard } from "@/components/List/ListCard";
import { Button } from "@/components/ui/button";
import { useFetchDoc, useFetchLists } from "@/firebase/fetchHook";
import { BoardType } from "@/utils/types";
import { useState } from "react";
import { useParams } from "react-router-dom";

export const BoardPage = () => {
  const { boardId } = useParams<{ boardId?: string }>();
  const [isBoardTitleUpdate, setIsBoardTitleUpdate] = useState(false);
  const [isAddList, setIsAddList] = useState(false);

  const board = useFetchDoc<BoardType[]>("boards", boardId ?? "");
  const lists = useFetchLists(boardId ?? "");

  if (!boardId) {
    return <p>No board Id</p>;
  }

  if (lists.isLoading) {
    return <p>...</p>;
  }

  if (lists.isError) {
    return <p>Error</p>;
  }

  const listsData = lists.data ?? [];
  const boardData = board.data ?? [];

  if (!boardData[0]) {
    return <p>...</p>;
  }

  const handleCloseInput = () => {
    if (isBoardTitleUpdate) {
      setIsBoardTitleUpdate(false);
    }
  };

  return (
    <main className="p-10" onClick={handleCloseInput}>
      <BoardForm
        boardId={boardId}
        value={boardData[0].title}
        isBoardTitleUpdate={isBoardTitleUpdate}
        setIsBoardTitleUpdate={setIsBoardTitleUpdate}
      />
      <section className="w-full border h-screen flex items-start flex-nowrap py-10 px-3 gap-5 overflow-x-scroll">
        {listsData.length === 0 ? (
          <p>No list</p>
        ) : (
          listsData.map((list) => <ListCard list={list} key={list.id} />)
        )}
        <section className="flex-1">
          {!isAddList ? (
            <Button className="w-full" onClick={() => setIsAddList(true)}>
              Add a list
            </Button>
          ) : (
            <AddList boardId={boardId} setIsAddList={setIsAddList} />
          )}
        </section>
      </section>
    </main>
  );
};

import { UpdateForm } from "@/components/Form/UpdateForm";
import { AddList } from "@/components/List/AddList";
import { ListCard } from "@/components/List/ListCard";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/ui/loader";
import { useFetchDoc, useFetchLists } from "@/firebase/fetchHook";
import { BoardType } from "@/utils/types";
import { useState } from "react";
import { useParams } from "react-router-dom";

export const BoardPage = () => {
  const { boardId } = useParams<{ boardId?: string }>();
  const [isBoardTitleUpdate, setIsBoardTitleUpdate] = useState(false);
  const [isAddList, setIsAddList] = useState(false);

  const board = useFetchDoc<BoardType[]>("boards", "boards", boardId ?? "");
  const lists = useFetchLists(boardId ?? "");

  if (!boardId) {
    return <p>No board Id</p>;
  }

  if (lists.isLoading) {
    return (
      <main className="h-screen flex items-center justify-center">
        <Loader data={{ color: "black", size: "6rem" }} />
      </main>
    );
  }

  if (lists.isError) {
    return <p>Error</p>;
  }

  const listsData = lists.data
    ? lists.data.sort((a, b) => a.createdAt - b.createdAt)
    : [];

  if (!board.data) {
    return <p> Super</p>;
  }

  const handleCloseInput = () => {
    if (isBoardTitleUpdate) {
      setIsBoardTitleUpdate(false);
    }
  };

  const boardData = board.data ?? [];

  if(!boardData[0]) {
    return <p>Super</p>
  }


  return (
    <main className="p-10" onClick={handleCloseInput}>
      <UpdateForm
        queryName="boards"
        databaseName="boards"
        id={boardId}
        value={boardData[0].title}
        isUpdate={isBoardTitleUpdate}
        setIsUpdate={setIsBoardTitleUpdate}
      />
      <section className="overflow-x-auto">
        <section className="flex items-start flex-nowrap py-10 px-3 gap-5">
          {listsData.length === 0 ? (
            <p>No list</p>
          ) : (
            listsData.map((list) => (
              <ListCard boardId={boardId} list={list} key={list.id} />
            ))
          )}
          <section className="flex-1 min-w-72">
            {!isAddList ? (
              <Button className="w-full" onClick={() => setIsAddList(true)}>
                Add a list
              </Button>
            ) : (
              <AddList boardId={boardId} setIsAddList={setIsAddList} />
            )}
          </section>
        </section>
      </section>
    </main>
  );
};

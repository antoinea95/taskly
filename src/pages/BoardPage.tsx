import { Loader } from "@/components/ui/loader";
import { useGetDoc } from "@/firebase/fetchHook";
import { BoardType } from "@/utils/types";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { ListsSection } from "../components/List/ListsSection";

export const BoardPage = () => {
  const { boardId } = useParams<{ boardId?: string }>();
  const {
    data: board,
    isLoading,
    isError,
  } = useGetDoc<BoardType>("boards", boardId);

  const [isBoardTitleUpdate, setIsBoardTitleUpdate] = useState(false);

  const handleCloseInput = () => {
    if (isBoardTitleUpdate) {
      setIsBoardTitleUpdate(false);
    }
  };

  if (isLoading) {
    return (
      <main className="p-10 flex justify-center items-start">
        <Loader data={{ color: "black", size: "6rem" }} />
      </main>
    );
  }

  if (isError) {
    <main className="p-10 flex justify-center items-start">
      <h1>An error occur</h1>
    </main>;
  }

  if(!board) {
    return (
      <h1>No board</h1>
    )
  }  

  return (
        <main className="p-10" onClick={handleCloseInput}>
          <section className="border">
            <h1 className="text-xl uppercase">{board.title}</h1>
          </section>
          <ListsSection boardId={board.id} />
        </main>
  );
};

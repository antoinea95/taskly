import { useBoardStore } from "../store/entityStore";
import { Board } from "../utils/types";
import { useEffect } from "react";
import { BoardCard } from "../components/Board/BoardCard";
import { Modal } from "@/components/ui/Modal";
import { AddBoard } from "@/components/Board/AddBoard";

export const Home = () => {
  const { items, getItems } = useBoardStore();

  useEffect(() => {
    getItems();
  }, [getItems]);


  const renderBoardSection = () => (
    <section className="grid grid-cols-4 gap-3 w-fit m-8">
      {items.map((board: Board) => (
        <BoardCard key={board.id} board={board} />
      ))}
    </section>
  );

  const renderEmptyState = () => (
    <section className="m-8">
      <div className="flex flex-col items-center justify-center border rounded-xl w-72 min-h-32 p-4">
        <p className="mb-1 text-center">You don't have any boards yet.</p>
        <Modal triggerName="Create one" dialogName="Add a new board">
          <AddBoard />
        </Modal>
      </div>
    </section>
  );

  return (
    <main className="w-screen h-screen p-8">
      <section className="flex justify-between items-center px-10">
        <h1 className="text-xl font-bold uppercase">Your boards</h1>
        <Modal triggerName="New Board" dialogName="Add a new board">
          <AddBoard />
        </Modal>
      </section>
      
      {items.length > 0 ? renderBoardSection() : renderEmptyState()}
    </main>
  );
};
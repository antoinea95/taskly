import { BoardCard } from "../components/Board/BoardCard";
import { Modal } from "@/components/ui/Modal";
import { AddBoard } from "@/components/Board/AddBoard";
import { ClipboardList } from "lucide-react";
import { useAuth } from "@/firebase/authHook";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useGetBoards } from "@/firebase/fetchHook";
import { BoardSkeleton } from "@/components/Board/BoardSkeleton";

export const HomePage = () => {
  const { currentUser } = useAuth();
  const userId = currentUser?.id;

  const { data: boards, isError, isFetched } = useGetBoards(userId);
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (isError) {
    return <p>Error</p>;
  }

  const renderBoardSection = () => {
    if (!isFetched) {
      return (
        <section className="grid grid-cols-4 gap-8 w-full mt-5">
          {Array.from({ length: 12 }).map((_, index) => (
            <BoardSkeleton key={index} />
          ))}
        </section>
      );
    } else if (boards && boards.length > 0) {
      return (
        <section className="grid grid-cols-4 gap-8 w-full mt-5">
          {boards
            .sort((a, b) => b.createdAt - a.createdAt)
            .map((board) => (
              <BoardCard key={board.id} board={board} />
            ))}
        </section>
      );
    } else {
      return (
        <section className="flex flex-col items-center justify-center mt-5 flex-1">
          <p className="mb-1 text-center text-4xl font-extralight text-gray-300">
            You don't have any boards yet.
          </p>
        </section>
      );
    }
  };

  return (
    <main className="mt-5 flex flex-col flex-1 w-full">
      <section className="flex justify-between items-center">
        <h1 className="text-xl font-bold uppercase">Your boards</h1>
        <Modal
          dialogName="Add a new board"
          setIsModalOpen={setIsModalOpen}
          isModalOpen={isModalOpen}
        >
          <Button
            onClick={() => setIsModalOpen(true)}
            className="flex justify-start items-center gap-2 p-5 rounded text-base"
          >
            <ClipboardList size={18} color="white" strokeWidth={2} />
            New board
          </Button>
          <AddBoard setIsModalOpen={setIsModalOpen} />
        </Modal>
      </section>
      {renderBoardSection()}
    </main>
  );
};

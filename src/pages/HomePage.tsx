import { BoardCard } from "../components/Board/BoardCard";
import { Modal } from "@/components/ui/Modal";
import { AddBoard } from "@/components/Board/AddBoard";
import { ClipboardList } from "lucide-react";
import { useAuth } from "@/firebase/authHook";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useGetBoards } from "@/firebase/fetchHook";
import { Header } from "@/components/Nav/Header";
import { HomeSkeleton } from "@/components/skeletons";

export const HomePage = () => {
  const { currentUser, isLoading} = useAuth();
  const userId = currentUser?.id;

  const { data: boards, isFetched } = useGetBoards(userId ?? "");
  const [isModalOpen, setIsModalOpen] = useState(false);

  if(!isFetched || isLoading) {
    return <HomeSkeleton />
  }


  return (
    <main className="flex flex-col flex-1 w-full">
      <Header user={currentUser} />
      <section className="flex justify-between items-center mt-10">
        <h1 className="text-5xl uppercase">Your boards</h1>
        <Modal
          title="Add a new board"
          setIsModalOpen={setIsModalOpen}
          isModalOpen={isModalOpen}
        >
          <Button
            onClick={() => setIsModalOpen(true)}
            className="flex justify-start items-center gap-2 p-5 rounded-xl text-base"
          >
            <ClipboardList size={18} color="white" strokeWidth={2} />
            New board
          </Button>
          <AddBoard setIsModalOpen={setIsModalOpen} />
        </Modal>
      </section>
        <section className="grid grid-cols-4 gap-8 w-full mt-10">
          {boards && isFetched && boards
            .sort((a, b) => b.createdAt - a.createdAt)
            .map((board) => (
              <BoardCard key={board.id} board={board} />
            ))}
        </section>
    </main>
  );
};
import { BoardCard } from "../components/Board/BoardCard";
import { Modal } from "@/components/ui/Modal";
import { AddBoard } from "@/components/Board/AddBoard";
import { ClipboardList } from "lucide-react";
import { useAuth } from "@/firebase/authHook";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useGetBoards } from "@/firebase/fetchHook";
import { HomeSkeleton } from "@/components/skeletons";
import { Header } from "@/components/Nav/Header";

export const HomePage = () => {
  const { currentUser, isLoading } = useAuth();
  const userId = currentUser?.id;

  const { data: boards, isError, isFetched, error } = useGetBoards(userId);
  const [isModalOpen, setIsModalOpen] = useState(false);


  // Gestion des erreurs
  if (isError) {
    return (
      <main className="p-10 flex justify-center items-start">
        <p>Failed to load boards: {error?.message || "Unknown error"}</p>
      </main>
    );
  }

  // Fonction de rendu des sections des boards
  const renderBoardSection = () => {
    // Si les données ne sont pas encore récupérées
    if (!isFetched) {
      return (
        <HomeSkeleton />
      );
    }

    // Si l'utilisateur a des boards
    if (boards && boards.length > 0) {
      return (
        <section className="grid grid-cols-4 gap-8 w-full mt-10">
          {boards
            .sort((a, b) => b.createdAt - a.createdAt)
            .map((board) => (
              <BoardCard key={board.id} board={board} />
            ))}
        </section>
      );
    }

    // Si l'utilisateur n'a aucun board
    return (
      <section className="flex flex-col items-center justify-center mt-5 flex-1">
        <p className="mb-1 text-center text-4xl font-extralight text-gray-300">
          You don't have any boards yet.
        </p>
      </section>
    );
  };

  return (
    <main className="flex flex-col flex-1 w-full animate-fade-in">
      <Header user={currentUser} isLoading={isLoading} />
      <section className="flex justify-between items-center mt-10">
        <h1 className="text-5xl uppercase">Your boards</h1>
        <Modal
          dialogName="Add a new board"
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
      {renderBoardSection()}
    </main>
  );
};

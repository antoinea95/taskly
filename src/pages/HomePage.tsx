import { BoardCard } from "../components/Board/BoardCard";
import { Modal } from "@/components/ui/Modal";
import { AddBoard } from "@/components/Board/AddBoard";
import { CirclePlus } from "lucide-react";
import { useAuth } from "@/firebase/authHook";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useGetBoards } from "@/firebase/fetchHook";

export const HomePage = () => {
  const {currentUser} = useAuth();
  const userId = currentUser?.uid;

  
  const boards = useGetBoards(userId);
  const [isModalOpen, setIsModalOpen] = useState(false);

  console.log(boards.data)

  if (boards.isError) {
    return <p>Error</p>;
  }

  if (!currentUser) {
    return <p>Veuillez vous connecter</p>;
  }

  if (boards.isSuccess) {
    const userBoards = boards.data.sort((a, b) => b.createdAt - a.createdAt);

    const renderBoardSection = () => (
      <section className="grid grid-cols-4 gap-3 w-fit m-8">
        {boards.isLoading ? (
          <Card className="w-72 h-32 flex flex-col justify-between overflow-hidden"></Card>
        ) : (
          userBoards.map((board) => <BoardCard key={board.id} board={board} />)
        )}
      </section>
    );

    const renderEmptyState = () => (
      <section className="m-8">
        <div className="flex flex-col items-center justify-center border rounded-xl w-full h-96 p-4">
          <p className="mb-1 text-center text-xl font-bold">
            You don't have any boards yet.
          </p>
        </div>
      </section>
    );

    return (
      <main className="w-screen h-screen p-8">
        <section className="flex justify-between items-center px-10">
          <h1 className="text-xl font-bold uppercase">Your boards</h1>
          <Modal
            dialogName="Add a new board"
            setIsModalOpen={setIsModalOpen}
            isModalOpen={isModalOpen}
          >
             <Button onClick={() => setIsModalOpen(true)}>
                <CirclePlus size={18} color="white" strokeWidth={2} className="mr-1"/>
                Add Board
              </Button>
            <AddBoard setIsModalOpen={setIsModalOpen} />
          </Modal>
        </section>
        {userBoards.length > 0 ? renderBoardSection() : renderEmptyState()}
      </main>
    );
  }
};

import { BoardType } from "../utils/types";
import { BoardCard } from "../components/Board/BoardCard";
import { Modal } from "@/components/ui/Modal";
import { AddBoard } from "@/components/Board/AddBoard";
import { CirclePlus } from "lucide-react";
import { useFireStoreApi } from "@/firebase/useFirestoreQuery";
import { Loader } from "@/components/ui/loader";

export const Home = () => {

  const {data, isLoading, error} = useFireStoreApi<BoardType[]>('boards')
  // const { items, getItems } = useBoardStore();

  if(isLoading) {
    return <Loader data={{color: "white", size: "24"}} />
  }

  if(!data) {
    return <p>Error</p>
  }

  const renderBoardSection = () => (
    <section className="grid grid-cols-4 gap-3 w-fit m-8">
      {data.map((board) => (
        <BoardCard key={board.id} board={board} />
      ))}
    </section>
  );

  const renderEmptyState = () => (
    <section className="m-8">
      <div className="flex flex-col items-center justify-center border rounded-xl w-72 min-h-32 p-4">
        <p className="mb-1 text-center">You don't have any boards yet.</p>
        <Modal
          triggerName="Create one"
          icon={CirclePlus}
          dialogName="Add a new board"
        >
          {({ closeModal }) => <AddBoard closeModal={closeModal} />}
        </Modal>
      </div>
    </section>
  );

  return (
    <main className="w-screen h-screen p-8">
      <section className="flex justify-between items-center px-10">
        <h1 className="text-xl font-bold uppercase">Your boards</h1>
        <Modal
          triggerName={`New Board`}
          icon={CirclePlus}
          dialogName="Add a new board"
        >
          {({ closeModal }) => <AddBoard closeModal={closeModal} />}
        </Modal>
      </section> 

      {data.length > 0 ? renderBoardSection() : renderEmptyState()}
    </main>
  );
};

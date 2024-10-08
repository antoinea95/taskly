import { BoardCard } from "../components/Board/BoardCard";
import { AddBoard } from "@/components/Board/AddBoard";
import { useAuth } from "@/firebase/authHook";
import { useGetBoards } from "@/firebase/fetchHook";
import { Header } from "@/components/Nav/Header";
import { HomeSkeleton } from "@/components/skeletons";

export const HomePage = () => {
  const { currentUser, isLoading} = useAuth();
  const userId = currentUser?.id;

  const { data: boards, isFetched } = useGetBoards(userId);

  if(!isFetched || isLoading) {
    return <HomeSkeleton />
  }


  return (
    <main className="flex flex-col flex-1 w-full">
      <Header user={currentUser} />
      <section className="flex justify-between items-start mt-10 relative">
        <h1 className="text-5xl uppercase">Your boards</h1>
        <div className="absolute right-0 top-0 w-60 flex justify-end">
          <AddBoard />
        </div>
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
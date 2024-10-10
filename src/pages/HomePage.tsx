import { BoardCard } from "../components/Board/BoardCard";
import { AddBoard } from "@/components/Board/AddBoard";
import { Header } from "@/components/Nav/Header";
import { HomeSkeleton } from "@/components/skeletons";
import { useAuth } from "@/utils/hooks/FirestoreHooks/auth/useAuth";
import { useGetBoards } from "@/utils/hooks/FirestoreHooks/queries/useGetBoards";

export const HomePage = () => {

  // Get user data
  const { currentUser, isLoading} = useAuth();
  const userId = currentUser?.id;

  // Fetch boards
  const { data: boards, isFetched } = useGetBoards(userId);


  //Loading state
  if(!isFetched || isLoading) {
    return <HomeSkeleton />
  }


  return (
    <main className="flex flex-col flex-1 w-full">
      <Header user={currentUser} />
      <section className="flex justify-between items-start mt-10 relative">
        <h1 className="text-5xl uppercase">Your boards</h1>
        <div className="absolute right-0 top-0 w-60 flex justify-end">
          <AddBoard user={currentUser} />
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
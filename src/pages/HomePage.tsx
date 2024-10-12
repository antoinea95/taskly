/**
 * HomePage component is the main view that displays the user's boards.
 * It retrieves the current authenticated user and their boards, then renders
 * the boards in a grid layout. If the data is still loading, it shows a skeleton screen.
 *
 * @returns The main layout of the home page, including the header, board grid, and add board button.
 */

import { BoardCard } from "../components/Board/BoardCard";
import { AddBoard } from "@/components/Board/AddBoard";
import { Header } from "@/components/Nav/Header";
import { HomeSkeleton } from "@/components/Skeletons/skeletons";
import { useAuth } from "@/utils/hooks/FirestoreHooks/auth/useAuth";
import { useGetBoards } from "@/utils/hooks/FirestoreHooks/queries/useGetBoards";

export const HomePage = () => {

  /**
   * Retrieves current authenticated user's data.
   * @returns {Object} currentUser - The current authenticated user object.
   * @returns {boolean} isLoading - Whether the authentication is still loading.
   */
  const { currentUser, isLoading } = useAuth();
  const userId = currentUser?.id;


  /**
   * Fetches the boards associated with the current user.
   * @returns {Array} boards - The list of board objects fetched from Firestore.
   * @returns {boolean} isFetched - Whether the boards data has been successfully fetched.
   */
  const { data: boards, isFetched } = useGetBoards(userId);


  // Show loading state if boards or user data is still being fetched
  if (!isFetched && isLoading) {
    return <HomeSkeleton />;
  }

  return (
    <main className="flex flex-col flex-1 w-full">
      {/** Header section with user information */}
      <Header user={currentUser} />

      {/** Section to display page title and the AddBoard button */}
      <section className="flex justify-between items-start mt-10 relative">
        <h1 className="text-5xl uppercase">Your boards</h1>
        <div className="absolute right-0 top-0 w-60 flex justify-end">
          <AddBoard user={currentUser} />
        </div>
      </section>

      {/** Section displaying a grid of the user's boards */}
      <section className="grid grid-cols-4 gap-8 w-full mt-10">
        {boards &&
          isFetched &&
          boards
            .sort((a, b) => b.createdAt - a.createdAt)
            .map((board) => <BoardCard key={board.id} board={board} />)}
      </section>
    </main>
  );
};

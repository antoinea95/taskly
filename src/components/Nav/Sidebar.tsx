import { ClipboardList, LogOut } from "lucide-react";
import { NavLink } from "react-router-dom";
import { AddBoard } from "../Board/AddBoard";
import { Skeleton } from "../ui/skeleton";
import { Member } from "../Members/Member";
import { useAuth } from "@/utils/hooks/FirestoreHooks/auth/useAuth";
import { useGetBoards } from "@/utils/hooks/FirestoreHooks/queries/useGetBoards";
import { useSignOut } from "@/utils/hooks/FirestoreHooks/auth/useSignOut";
import { Button } from "../ui/button";

/**
 * Sidebar component displays the user's boards, navigation options, user profile,
 * and logout functionality.
 *
 * @returns The sidebar component JSX.
 */
export const Sidebar = () => {
  const { currentUser } = useAuth(); // Get the current user from auth hook
  const userId = currentUser?.id; // Extract the user ID if user exists
  const { data: boards, isLoading } = useGetBoards(userId); // Fetch boards for the current user
  const signOut = useSignOut(); // Hook to sign out the user

  /**
   * Handles logging out the user and navigating to the login page.
   */
  const handleLogOut = async (): Promise<void> => {
    await signOut.mutateAsync(); // Sign out the user asynchronously
  };

  /**
   * If the user is not logged in and loading is finished, redirect to login page.
   */

  // useEffect(() => {
  //   if (!currentUser && !isLoading) {
  //     navigate("/login");
  //   }
  // }, [currentUser, isLoading, navigate]);

  return (
    <section className="font-outfit flex-1 flex flex-col pb-2 w-full dark:text-gray-300">
      {/* Boards section */}
      <div className="font-medium space-y-2 w-full">
        <h2 className="uppercase flex items-center gap-2">
          <ClipboardList size={20} />
          Boards
        </h2>

        {/* Display loading skeleton or boards if available */}
        {isLoading ? (
          <Skeleton className="w-full h-10" />
        ) : boards && boards.length > 0 ? (
          boards.map((board) => (
            <NavLink
              key={board.id}
              to={`/${board.id}`}
              className={({ isActive }) =>
                `text-sm rounded-xl w-full flex items-center p-3 hover:bg-gray-200 dark:hover:bg-gray-700 ${
                  isActive ? "bg-gray-100 dark:bg-gray-700" : ""
                }`
              }
            >
              {board.title}
            </NavLink>
          ))
        ) : (
          <p className="w-full flex items-center justify-center text-gray-300 uppercase py-2">
            No boards available
          </p>
        )}

        {/* Component to add new boards */}
        <AddBoard user={currentUser} />
      </div>

      {/* Profile and logout section */}
      <div className="mb-0 mt-auto space-y-2">
        {/* Render user profile or loading skeleton if user is not available */}
        {currentUser ? (
          <NavLink
            to={`/profile`}
            className={({ isActive }) =>
              `rounded-xl w-full flex items-center gap-2 p-3 hover:bg-gray-200 dark:hover:bg-gray-700 ${
                isActive ? "bg-gray-100 dark:bg-gray-700" : ""
              }`
            }
          >
              <Member userId={currentUser.id} type="avatar" />
              {currentUser.name}
          </NavLink>
        ) : (
          <Skeleton className="w-60 h-10" />
        )}

        {/* Log out button */}
        <Button
          className="flex items-center justify-start gap-2 w-full h-12 rounded-xl bg-transparent hover:bg-gray-200 dark:bg-transparent dark:text-gray-300 dark:hover:bg-gray-700"
          onClick={handleLogOut}
          variant="secondary"
        >
          <LogOut /> Log out
        </Button>
      </div>
    </section>
  );
};

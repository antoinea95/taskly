import { ClipboardList, LogOut } from "lucide-react";
import { NavLink } from "react-router-dom";
import { AddBoard } from "../Board/AddBoard";
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
  const { data: boards, isFetched } = useGetBoards(userId); // Fetch boards for the current user
  const signOut = useSignOut(); // Hook to sign out the user

  /**
   * Handles logging out the user and navigating to the login page.
   */
  const handleLogOut = async (): Promise<void> => {
    await signOut.mutateAsync(); // Sign out the user asynchronously
  };

  return (
    <section className="font-outfit flex-1 flex flex-col pb-2 w-full dark:text-gray-300 animate-top-to-bottom">
      {/* Boards section */}
      <div className="font-medium space-y-2 w-full">
        <h2 className="uppercase flex items-center gap-2">
          <ClipboardList size={20} />
          Boards
        </h2>

        {/* Display loading skeleton or boards if available */}
        {!isFetched ? (
          null
        ) : boards && boards.length > 0 ? (
          boards.map((board) => (
            <NavLink
              key={board.id}
              to={`/${board.id}`}
              className={({ isActive }) =>
                `text-sm rounded-xl w-full h-10 flex items-center p-3 animate-top-to-bottom hover:bg-gray-200 dark:hover:bg-gray-700 ${
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
      <div className="mb-0 mt-auto space-y-1 py-3">
        {/* Render user profile or loading skeleton if user is not available */}
        {currentUser ? (
          <NavLink
            to={`/profile`}
            className={({ isActive }) =>
              `rounded-xl w-full h-10 flex items-center gap-2 p-3 hover:bg-gray-200 dark:hover:bg-gray-700 ${
                isActive ? "bg-gray-100 dark:bg-gray-700" : ""
              }`
            }
          >
              <Member userId={currentUser.id} type="avatar" />
              {currentUser.name}
          </NavLink>
        ) : (
          null
        )}

        {/* Log out button */}
        <Button
          className="flex items-center shadow-none justify-start gap-2 w-full h-10 rounded-xl bg-transparent hover:bg-gray-200 dark:bg-transparent dark:text-gray-300 dark:hover:bg-gray-700"
          onClick={handleLogOut}
          variant="secondary"
        >
          <LogOut /> Log out
        </Button>
      </div>
    </section>
  );
};

import { UserType } from "@/utils/types/auth.types";
import { BoardType } from "@/utils/types/boards.types";
import { useGetUsersInBoard } from "@/utils/hooks/FirestoreHooks/queries/useGetUsers";
import { useState, ChangeEvent, useEffect } from "react";

/**
 * Custom hook to filter and search users based on their membership in a board and search input.
 * This hook provides:
 * - Filtering users who are not already members of the provided board.
 * - Searching users by name using a search query.
 *
 * @param {string[]} members - Array of user IDs representing members of the board.
 * @param {BoardType} [board] - The board to filter users by their membership (optional).
 * @returns The search results, search handler function, and the fetching status of users.
 */
export const useFilteredUsersInTasks = (members: string[], taskMembers: string[], board?: BoardType) => {
  const { data: users } = useGetUsersInBoard(members, board?.id);
  const [searchResults, setSearchResults] = useState<UserType[] | null>(null);

  useEffect(() => {
    if(users) {
        const usersInBoard = users;
        usersInBoard.filter((user) => !taskMembers.includes(user.id));
        setSearchResults(usersInBoard);
    }
  }, [taskMembers, users]);
  /**
   * Handles the search functionality for filtering users by name.
   *
   * @param {ChangeEvent<HTMLInputElement>} e - The input change event containing the search query.
   */
  const handleSearchByName = (e: ChangeEvent<HTMLInputElement>) => {
    const searchQuery = e.target.value.toLowerCase();
    if (users) {
      const filtered = users.filter((user) => user.name.toLowerCase().includes(searchQuery));
      setSearchResults(filtered);
    }
  };

  return {
    searchResults,
    handleSearchByName,
  };
};

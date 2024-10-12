import { UserType } from "@/utils/types/auth.types";
import { BoardType } from "@/utils/types/boards.types";
import { useGetUsers } from "@/utils/hooks/FirestoreHooks/queries/useGetUsers";
import { useState, useEffect, ChangeEvent } from "react";

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
export const useFilteredUsers = (
  members: string[],
  board?: BoardType,
) => {
  const { data: users, isFetched } = useGetUsers();
  const [filterUsers, setFilterUsers] = useState<UserType[] | null>(null);
  const [searchResults, setSearchResults] = useState<UserType[] | null>(null);

  useEffect(() => {
    if (users && isFetched) {

      let allUsers = users;
      
      // Filter users who are members of the provided board
      if (board) {
        allUsers = allUsers.filter((user) => board.members.includes(user.id));
      }

      // Filter out users who are already members
      const nonMembers = allUsers.filter((user) => !members.includes(user.id));
      setFilterUsers(nonMembers);
      setSearchResults(nonMembers);
    }
  }, [users, isFetched, members, board]);

  /**
   * Handles the search functionality for filtering users by name.
   * 
   * @param {ChangeEvent<HTMLInputElement>} e - The input change event containing the search query.
   */
  const handleSearchByName = (e: ChangeEvent<HTMLInputElement>) => {
    const searchQuery = e.target.value.toLowerCase();
    if (filterUsers) {
      const filtered = filterUsers.filter((user) =>
        user.name.toLowerCase().includes(searchQuery)
      );
      setSearchResults(filtered);
    }
  };

  return {
    searchResults,
    handleSearchByName,
    isFetched,
  };
};

import { useState } from "react";

/**
 * Custom hook to manage the selection of user IDs. 
 * Provides functionality to add or remove users from the selection.
 * 
 * @returns Contains the list of selected user IDs, a setter for the selected IDs, and a function to toggle user selection.
 */
export const useSelectedUsers = () => {
  const [selectedUserIds, setSelectedUsersId] = useState<string[]>([]);

  /**
   * Handles the selection or deselection of a user by their ID.
   * If the user ID is already selected, it removes it. Otherwise, it adds the ID to the selection.
   * 
   * @param {string} id - The ID of the user to select or deselect.
   */
  const handleSelectUser = (id: string) => {
    setSelectedUsersId((prev) =>
      prev.includes(id) ? prev.filter((selectedId) => selectedId !== id) : [...prev, id]
    );
  };

  return {
    selectedUserIds, // List of selected user IDs
    setSelectedUsersId, // Setter function to update selected user IDs
    handleSelectUser, // Function to toggle selection of a user by ID
  };
};

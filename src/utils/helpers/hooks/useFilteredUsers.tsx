import { useGetUserByEmail } from "@/utils/hooks/FirestoreHooks/queries/useGetUsers";
import { useState, ChangeEvent } from "react";
import { z } from "zod";

/**
 * Custom hook to filter and search users based on their membership in a board and search input.
 * This hook provides:
 * - Filtering users who are not already members of the provided board.
 * - Searching users by email using a search query.
 * 
 */
export const useFilteredUsers = (
) => {
  const [email, setEmail] = useState<string | null>(null);
  const userEmail = z.string().email({ message: "Invalid email address" });
  const isEmailValid = userEmail.safeParse(email);

  const { data} = useGetUserByEmail(email ? email : undefined);

  /**
   * Handles the search functionality for filtering users by name.
   * 
   * @param {ChangeEvent<HTMLInputElement>} e - The input change event containing the search query.
   */
  const handleSearchByName = (e: ChangeEvent<HTMLInputElement>) => {
    const searchQuery = e.target.value.toLowerCase();
    if(userEmail.safeParse(searchQuery).success) {
      setEmail(searchQuery);
    } else {
      setEmail(null)
    }
  };

  return {
    handleSearchByName,
    setEmail,
    email,
    user: data ? data[0] : null,
    isEmailValid
  };
};

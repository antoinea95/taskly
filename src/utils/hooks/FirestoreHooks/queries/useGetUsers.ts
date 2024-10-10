import { UserType } from "@/utils/types";
import { useFirestoreQuery } from "./useFirestoreQuery";

/**
 * Custom hook to fetch users from the Firestore "users" collection.
 * 
 * @returns A React Query result object with the fetched user data.
 */
export const useGetUsers = () => {
    return useFirestoreQuery<UserType>({
      collectionName: "users",
      key: ["users"],
    });
  };
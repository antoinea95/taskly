import { UserType } from "@/utils/types/auth.types";
import { useFirestoreQuery } from "./useFirestoreQuery";
import { documentId, where } from "firebase/firestore";

/**
 * Custom hook to fetch users from the Firestore "users" collection.
 * 
 * @returns A React Query result object with the fetched user data.
 */
export const useGetUserByEmail = (email?:string) => {
    return useFirestoreQuery<UserType[]>({
      collectionName: "users",
      key: ["user", email],
      filterFn: () => [where("email", "==", email)],
      enabled: !!email,
    });
  };

/**
 * Custom hook to fetch users from the Firestore "users" collection.
 * 
 * @returns A React Query result object with the fetched user data.
 */
export const useGetUsersInBoard = (ids: string[], boardId?:string) => {
  return useFirestoreQuery<UserType[]>({
    collectionName: "users",
    key: ["user", boardId],
    filterFn: () => [where(documentId(), "in", ids)],
    enabled: !!boardId,
  });
};
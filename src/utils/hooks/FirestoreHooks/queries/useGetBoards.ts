import { BoardType } from "@/utils/types/boards.types";
import { useFirestoreQuery } from "./useFirestoreQuery";
import { where } from "firebase/firestore";

/**
 * Custom hook to fetch boards from the Firestore "boards" collection, filtered by user membership.
 * 
 * @param userId - The optional user ID to filter boards by users who are members.
 * @returns  A React Query result object with the fetched board data.
 */
export const useGetBoards = (userId?: string) => {
    return useFirestoreQuery<BoardType[]>({
      collectionName: "boards",
      key: ["boards", userId],
      filterFn: () => [where("members", "array-contains", userId)],
      enabled: !!userId,
    });
  };
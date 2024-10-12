import { ListType } from "@/utils/types/types";
import { useFirestoreQuery } from "./useFirestoreQuery";
import { where } from "firebase/firestore";

/**
 * Custom hook to fetch lists from the Firestore "lists" collection, filtered by board ID.
 * 
 * @param boardId The board ID to filter lists by the board it belongs to.
 * @returns A React Query result object with the fetched list data.
 */
export const useGetLists = (boardId: string) => {
    return useFirestoreQuery<ListType[]>({
      collectionName: "lists",
      key: ["lists", boardId],
      filterFn: () => [where("boardId", "==", boardId)],
      enabled: !!boardId,
    });
  };
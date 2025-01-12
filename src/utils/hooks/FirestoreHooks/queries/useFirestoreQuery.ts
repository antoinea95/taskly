import { useQuery } from "@tanstack/react-query";
import { UseFirestoreQueryProps } from "../../hooks.types";
import { FirestoreService } from "@/utils/firebase/firestore/firestoreService";
  
  /**
   * Custom hook to fetch data from a Firestore collection or document using React Query.
   * It fetches either a single document if `documentId` is provided or a collection if `documentId` is not provided.
   * 
   * @template T - The type of data returned by the query (e.g., array or single document).
   * @param props - The properties for the query including the collection name, query key, optional document ID, filter function, and enabled flag.
   * 
   * @returns  A React Query result object containing the fetched data or an error.
   */
  export const useFirestoreQuery = <T,>({
    collectionName,
    key,
    documentId,
    filterFn,
    enabled = true,
  }: UseFirestoreQueryProps) => {
    return useQuery<T, Error>({
      queryKey: key,
      queryFn: async () => {
        if (documentId) {
          const document = await FirestoreService.fetchDoc<T>(collectionName, documentId);
          if (!document) throw new Error(`Document not found in ${collectionName}`);
          return document;
        } else {
          const collection = await FirestoreService.fetchDocs<T>(collectionName, filterFn);
          return collection as T;
        }
      },
      enabled,
    });
  };
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { FirestoreService } from "@/utils/firebase/firestore/firestoreService";
import { useEffect } from "react";
import { UseFirestoreQueryProps } from "../../hooks.types";
import { query as firestoreQuery } from "firebase/firestore";

/**
 * Custom hook to fetch data from a Firestore collection or document using React Query in real-time.
 * It fetches either a single document if documentId is provided or a collection if documentId is not provided.
 *
 * @template T - The type of data returned by the query (e.g., array or single document).
 * @param collectionName - The name of the Firestore collection or document.
 * @param firebasePathKey - The query key to identify the query in React Query.
 * @param useQueryOptions - Optional React Query options to customize query behavior.
 * @param documentId - Optional document ID to fetch a single document (if undefined, fetches the entire collection).
 * @param filterFn - Optional filter function to apply to the collection query.
 *
 * @returns  A React Query result object containing the fetched data or an error.
 */
export const useFirestoreQuery = <T>({ collectionName, key, documentId, filterFn, enabled }: UseFirestoreQueryProps) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (enabled) {
      const unsubscribe = documentId
        ? FirestoreService.subscribeToDocument<T>(
            collectionName,
            documentId,
            (data) => {
              queryClient.setQueryData(key, data);
            },
            (error) => {
              console.error(`Error fetching document ${documentId}:`, error);
            }
          )
        : FirestoreService.subscribeToCollection<T>(
            collectionName,
            (data) => {
              queryClient.setQueryData(key, data);
            },
            (error) => {
              console.error(`Error fetching collection ${collectionName}:`, error);
            },
            filterFn ? (colRef) => firestoreQuery(colRef, ...filterFn(colRef)) : undefined
          );

      return () => unsubscribe(); // Cleanup on unmount
    }
  }, [queryClient, key, collectionName, documentId, filterFn, enabled]);

  return useQuery<T, Error>({
    queryKey: key,
    queryFn: () => new Promise<T>(() => {}), // No need to perform a fetch here, as the data is being updated in real-time.
    staleTime: 0, // Ensure React Query knows the data is always fresh
    enabled,
  });
};

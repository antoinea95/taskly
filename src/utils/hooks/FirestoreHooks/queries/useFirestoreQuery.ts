import { useQuery } from "@tanstack/react-query";
import {
  CollectionReference,
  query as firestoreQuery,
} from "firebase/firestore";
import { UseFirestoreQueryProps } from "../../hooks.types";
import { FirestoreService } from "@/utils/firebase/firestore/firestoreService";

  
  /**
   * Fetch a single document and return the result.
   */
  const fetchDocument = <T,>(collectionName: string, documentId: string): Promise<T> => {
    return new Promise<T>((resolve) => {
      const unsubscribe = FirestoreService.subscribeToDocument<T>(
        collectionName,
        documentId,
        (data) => {
          resolve(data);
          unsubscribe(); // Nettoie après la réception des données
        },
        `Error while getting data from ${collectionName}`,
      );
    });
  };
  
  /**
   * Fetch a collection and return the result.
   * Applies optional filtering and transformation functions.
   */
  const fetchCollection = <T,>(
    collectionName: string,
    filterFn?: (colRef: CollectionReference) => any,
  ): Promise<T> => {
    return new Promise<T>((resolve) => {
      const unsubscribe = FirestoreService.subscribeToCollection<T>(
        collectionName,
        (data) => {
          resolve(data as T);
          unsubscribe(); // Nettoie après la réception des données
        },
        `Error while getting data from ${collectionName}`,
        filterFn ? (colRef) => firestoreQuery(colRef, ...filterFn(colRef)) : undefined,
      );
    });
  };
  
  
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
    enabled,
  }: UseFirestoreQueryProps) => {
    return useQuery<T, Error>({
      queryKey: key,
      queryFn: async () => {
        if (documentId) {
          return fetchDocument<T>(collectionName, documentId);
        } else {
          return fetchCollection<T>(collectionName, filterFn);
        }
      },
      staleTime: Infinity, // Provides persistent data until it is invalidated.
      enabled, // Conditionally enables or disables the hook execution based on the provided flag.
    });
  };
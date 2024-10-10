import { WithoutId } from "../../hooks.types";
import { useFirestoreMutation } from "./useFirestoreMutation";
import { FirestoreService } from "@/utils/firebase/firestore/firestoreService";

/**
 * Hook to add a document to Firestore.
 * Uses the FirestoreApi to create a new document in the specified collection.
 * Automatically invalidates the related query after a successful mutation.
 * 
 * @template T The type of the data being added.
 * @param key The query key used to invalidate the cache.
 * @param collectionName The Firestore collection where the document will be added.
 * @returns A mutation result object from react-query.
 */
export const useAddDoc = <T,>(
    key: any[],
    collectionName: string,
  ) => {
  
    return useFirestoreMutation<string, WithoutId<T>>((data) => {
      if (data) {
        return FirestoreService.createDocument<T>(collectionName, data);
      }
      return Promise.reject(new Error("No data"));
    }, key);
  };
import { useFirestoreMutation } from "./useFirestoreMutation";
import { FirestoreService } from "@/utils/firebase/firestore/firestoreService";

/**
 * Hook to delete a document from Firestore.
 * Uses the FirestoreApi to delete the specified document.
 * Automatically invalidates the related query after a successful mutation.
 * 
 * @param key The query key used to invalidate the cache.
 * @param collectionName The Firestore collection where the document exists.
 * @param id The ID of the document to delete.
 * @returns A mutation result object from react-query.
 */
export const useDeleteDoc = (
    key: any[],
    collectionName: string,
    id?: string,
  ) => {
  
    return useFirestoreMutation<void, void>(() => {
      if (id) {
        return FirestoreService.deleteDocument(collectionName, id);
      }
      return Promise.reject(new Error("Document ID is not defined"));
    }, key);
  };
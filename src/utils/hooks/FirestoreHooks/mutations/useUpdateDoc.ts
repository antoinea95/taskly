import { useFirestoreMutation } from "./useFirestoreMutation";
import { FirestoreService } from "@/utils/firebase/firestore/firestoreService";

/**
 * Hook to update an existing document in Firestore.
 * Uses the FirestoreApi to update the document with the provided data.
 * Automatically invalidates the related query after a successful mutation.
 * 
 * @template T The type of the document being updated.
 * @param key The query key used to invalidate the cache.
 * @param collectionName The Firestore collection where the document exists.
 * @param documentId The ID of the document to update.
 * @param queryCollection Optional query collection(s) to invalidate on mutation success.
 * @returns A mutation result object from react-query.
 */
export const useUpdateDoc = <T,>(
    key: any[],
    collectionName: string,
    documentId?: string,
    queryCollection?: string[]
  ) => {
    return useFirestoreMutation<string, T>(
      (data) => {
        if (documentId && data) {
          return FirestoreService.updateDocument<T>(collectionName, data, documentId);
        }
        return Promise.reject(new Error("Document ID is not defined or no data"));
      },
      key,
      queryCollection
    );
  };
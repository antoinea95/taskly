import { useFirestoreMutation } from "./useFirestoreMutation";
import { StorageService } from "@/utils/firebase/storage/storageService";

/**
 * Hook to upload a profile picture to Firestore.
 * Uses the FirestoreApi to import the file into the specified document.
 * 
 * @param key The query key used to invalidate the cache.
 * @param file The file to upload (could be `null` if no file is selected).
 * @param documentId The ID of the document to associate with the uploaded file.
 * @returns A mutation result object from react-query.
 */
export const useUploadProfilePic = (
    key: any[],
    file: File | null,
    documentId?: string
  ) => {
    return useFirestoreMutation<void, void>(() => {
      if (documentId && file) {
        return StorageService.ImportFile(file, documentId);
      }
      return Promise.reject(new Error("Document ID is not defined"));
    }, key);
  };
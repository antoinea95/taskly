import { StorageService } from "@/utils/firebase/storage/storageService";
import { useFirestoreMutation } from "./useFirestoreMutation";
import { BatchService } from "@/utils/firebase/firestore/batchService";

/**
 * Hook to delete a board from Firestore.
 * Uses the FirestoreApi to delete the specified board.
 * 
 * @param userId Optional user ID for cache invalidation.
 * @param id The ID of the board to delete.
 * @returns A mutation result object from react-query.
 */
export const useDeleteBoard = <T,>(userId?: string, id?: string) => {
    return useFirestoreMutation<void, T>(() => {
      if (id) {
        return BatchService.deleteBoard(id);
      }
      return Promise.reject(new Error("Document ID is not defined"));
    }, ["boards", userId]);
  };
  
  /**
   * Hook to delete a list from Firestore.
   * Uses the FirestoreApi to delete the specified list.
   * 
   * @param boardId The ID of the board the list belongs to.
   * @param id The ID of the list to delete.
   * @returns A mutation result object from react-query.
   */
  export const useDeleteList = <T,>(boardId: string, id?: string) => {
    return useFirestoreMutation<void, T>(() => {
      if (id) {
        return BatchService.deleteList(id);
      }
      return Promise.reject(new Error("Document ID is not defined"));
    }, ["lists", boardId]);
  };
  
  /**
   * Hook to delete a task from Firestore.
   * Uses the FirestoreApi to delete the specified task.
   * 
   * @param id The ID of the task to delete.
   * @returns A mutation result object from react-query.
   */
  export const useDeleteTask = <T,>(id?: string) => {
    return useFirestoreMutation<void, T>(() => {
      if (id) {
        return BatchService.deleteTask(id);
      }
      return Promise.reject(new Error("Document ID is not defined"));
    }, ["tasks", id]);
  };

   /**
   * Hook to delete a file from task.
   * Uses the FirestoreApi to delete the specified files.
   * 
   * @param id The ID of the task.
   * @param fileName the name of the file to delete
   * @returns A mutation result object from react-query.
   */
   export const useDeleteFileFromTask = (fileName: string, id?: string) => {
    return useFirestoreMutation<void, void>(() => {
      if (id) {
        return StorageService.deleteFileFromTask(fileName, id);
      }
      return Promise.reject(new Error("Document ID is not defined"));
    }, ["tasks", id]);
  };
  
  /**
   * Hook to delete a checklist from Firestore.
   * Uses the FirestoreApi to delete the specified checklist associated with a task.
   * 
   * @param taskId The ID of the task the checklist belongs to.
   * @param id The ID of the checklist to delete.
   * @returns A mutation result object from react-query.
   */
  export const useDeleteChecklist = <T,>(taskId: string, id?: string) => {
    return useFirestoreMutation<void, T>(() => {
      if (id) {
        return BatchService.deleteCheckList(id, taskId);
      }
      return Promise.reject(new Error("Document ID is not defined"));
    }, ["checklists", taskId]);
  };
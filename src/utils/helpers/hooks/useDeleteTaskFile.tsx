import { useDeleteFileFromTask } from "@/utils/hooks/FirestoreHooks/mutations/useDeletions";
import { useQueryClient } from "@tanstack/react-query";
import { Dispatch, SetStateAction } from "react";


/**
 * Custom hook to handle the deletion of a file from a task.
 *
 * @param {string} taskId - The ID of the task from which the file will be deleted.
 * @param {string} fileName - The name of the file to be deleted.
 * @param {Dispatch<SetStateAction<number | null>>} [setActiveImageIndex] - Optional state setter to reset the active image index (e.g., for galleries or previews).
 *
 * returns {Object} The hook's API.
 * returns {Function} handleFileDelete - A function to trigger the file deletion process.
 * returns {Object} deleteFileFromTask - The mutation object returned by the `useDeleteFileFromTask` hook.
 */
export const useDeleteTaskFile = (taskId: string, fileName: string, setActiveImageIndex?:Dispatch<SetStateAction<number | null>>) => {
  const deleteFileFromTask = useDeleteFileFromTask(fileName, taskId);
  const queryClient = useQueryClient();

  /**
   * Deletes the file from the task and performs additional side effects such as resetting the active image index and invalidating the cache.
   * @async
   */
  const handleFileDelete = async () => {
    await deleteFileFromTask.mutateAsync(undefined, {
      onSuccess: () => {
        if(setActiveImageIndex) setActiveImageIndex(null)
        queryClient.invalidateQueries({ queryKey: ["tasks"] })
    },
    });
  };

  return { handleFileDelete, deleteFileFromTask };
};

import { TaskType } from "@/utils/types/tasks.types";
import { useFirestoreQuery } from "./useFirestoreQuery";
import { documentId, where } from "firebase/firestore";

/**
 * Custom hook to fetch tasks from the Firestore "tasks" collection based on a list ID and task IDs.
 * 
 * @param taskIds - An array of task IDs to filter the tasks.
 * @param listId - The ID of the list to filter the tasks by.
 * @returns A React Query result object with the fetched task data.
 */
export const useGetTasks = (taskIds: string[], listId: string) => {
    return useFirestoreQuery<TaskType[]>({
      collectionName: "tasks",
      key: ["tasks", listId],
      filterFn: () => [where(documentId(), "in", taskIds)],
    });
  };
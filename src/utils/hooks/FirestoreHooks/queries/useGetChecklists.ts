import { CheckListItemType, CheckListType } from "@/components/types/tasks.types";
import { useFirestoreQuery } from "./useFirestoreQuery";

/**
 * Custom hook to fetch checklists from a specific task in Firestore.
 * 
 * @param taskId - The ID of the task for which to fetch the checklists.
 * @returns A React Query result object with the fetched checklist data.
 */
export const useGetChecklists = (taskId: string) => {
    return useFirestoreQuery<CheckListType[]>({
      collectionName: `tasks/${taskId}/checklists`,
      key: ["checklists", taskId],
      enabled: !!taskId,
    });
  };
  
  /**
   * Custom hook to fetch checklist items from a specific checklist in Firestore.
   * 
   * @param taskId - The ID of the task that contains the checklist.
   * @param checklistId - The ID of the checklist for which to fetch the items.
   * @returns  A React Query result object with the fetched checklist item data.
   */
  export const useGetChecklistItems = (taskId: string, checklistId: string) => {
    return useFirestoreQuery<CheckListItemType[]>({
      collectionName: `tasks/${taskId}/checklists/${checklistId}/items`,
      key: ["checklistItems", checklistId],
      enabled: !!taskId,
    });
  };
  
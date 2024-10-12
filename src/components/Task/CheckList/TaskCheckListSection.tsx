import { TaskCheckList } from "./TaskCheckList";
import { CheckListItemType } from "@/utils/types/tasks.types";
import { CheckSquare } from "lucide-react";
import { useQueries } from "@tanstack/react-query";
import { useGetChecklists } from "@/utils/hooks/FirestoreHooks/queries/useGetChecklists";
import { FirestoreService } from "@/utils/firebase/firestore/firestoreService";
import { Label } from "@/components/Label/Label";

/**
 * TaskCheckListSection component that displays a list of checklists related to a task.
 * It either shows the individual checklist items in a card format or just displays 
 * a summary of completed items if the section is rendered as a card.
 * 
 * @param {Object} props - The component props.
 * @param {string} props.taskId - The ID of the task the checklists belong to.
 * @param {boolean} [props.isCard] - A flag indicating whether to render the section as a card summary or not.
 * 
 * @returns  The rendered TaskCheckListSection component.
 */
export const TaskCheckListSection = ({
  taskId,
  isCard,
}: {
  taskId: string;
  isCard?: boolean;
}) => {
  const { data: checklists, isFetched } = useGetChecklists(taskId);

  /**
   * Fetch checklist items for a given checklist ID.
   * 
   * @param {string} checklistId - The ID of the checklist to fetch items for.
   * 
   * @returns  A promise that resolves with the checklist items.
   */
  const fetchChecklistItems = async (checklistId: string) => {
    const fetchedCheckListItems = await FirestoreService.fetchDocs<CheckListItemType>(
      `tasks/${taskId}/checklists/${checklistId}/items`,
    );
    return fetchedCheckListItems;
  };

  const fetchedItemsData = useQueries({
    queries: (checklists || []).map((checklist) => ({
      queryKey: ["checklistItems", checklist.id],
      queryFn: () => fetchChecklistItems(checklist.id),
      staleTime: Infinity,
    })),
  });

  const itemsData = fetchedItemsData.flatMap((result) => result.data || []);

  // If rendering as a card and there are completed checklist items, show the summary
  if (isCard && itemsData.length > 0 && checklists && checklists?.length > 0) {
    return (
      <Label color="#d1d5db">
        <CheckSquare size={12} />
        {itemsData.filter((item) => item.done).length}/{itemsData.length}
      </Label>
    );
  }

  return (
    <>
      {checklists &&
        isFetched &&
        !isCard &&
        checklists.map((checklist) => (
          <TaskCheckList
            taskId={taskId}
            checkList={checklist}
            key={checklist.id}
          />
        ))}
    </>
  );
};

import { useGetChecklists } from "@/firebase/fetchHook";
import { TaskCheckList } from "./TaskCheckList";
import { CheckListItemType } from "@/utils/types";
import FirestoreApi from "@/firebase/FirestoreApi";
import { CheckSquare } from "lucide-react";
import { useQueries } from "@tanstack/react-query";

export const TaskCheckListSection = ({
  taskId,
  isCard,
}: {
  taskId: string;
  isCard?: boolean;
}) => {
  const { data: checklists, isFetched } = useGetChecklists(taskId);

  const fetchChecklistItems = async (checklistId: string) => {
    console.log(taskId, checklistId);
    const fetched = await FirestoreApi.fetchDocs<CheckListItemType>({
      collectionName: `tasks/${taskId}/checklists/${checklistId}/items`,
    });
    return fetched;
  };

  const fetchedItemsData = useQueries({
    queries: (checklists || []).map((checklist) => ({
      queryKey: ["checklistItems", checklist.id],
      queryFn: () => fetchChecklistItems(checklist.id),
      staleTime: Infinity,
    })),
  });

  const itemsData = fetchedItemsData.flatMap((result) => result.data || []);

  if (isCard && itemsData.length > 0 && checklists && checklists?.length > 0) {
    return (
      <div className="uppercase font-bold px-2 py-1 rounded-lg text-xs flex items-center gap-1 bg-gray-50">
        <CheckSquare size={14} />
        <p className="text-sm">
          {itemsData.filter((item) => item.done).length}/{itemsData.length}
        </p>
      </div>
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

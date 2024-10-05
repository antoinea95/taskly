import { CheckListItemType, CheckListType } from "@/utils/types";
import { ListCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { useGetChecklistItems } from "@/firebase/fetchHook";
import { TaskCheckListItem } from "./TaskCheckListItem";
import { AddItem } from "../../Form/AddItem";
import { useAddDoc, useDeleteDoc, useUpdateDoc } from "@/firebase/mutateHook";
import { DeleteItem } from "../../Form/DeleteItem";
import { UpdateTitle } from "@/components/Form/UpdateTitle";

export const TaskCheckList = ({
  taskId,
  checkList,

}: {
  taskId: string;
  checkList: CheckListType;
}) => {
  const { data: checklistItems, isFetched } = useGetChecklistItems(
    taskId,
    checkList.id
  );
  const [completeBarWidth, setCompleteBarWidth] = useState<number | null>(null);
  
  const addCheckListItems = useAddDoc<CheckListItemType>(
    "checklistItems",
    `tasks/${taskId}/checklists/${checkList.id}/items`,
    checkList.id
  );

  const updateCheckList = useUpdateDoc<CheckListType>("checklists", `tasks/${taskId}/checklists`, checkList.id, taskId);
  const deleteChecklist = useDeleteDoc(
    "checklists",
    `tasks/${taskId}/checklists`,
    checkList.id,
    taskId
  );

  const [isAddItem, setisAddItem] = useState(false);

  const onSubmit = async (data: { title: string }) => {
    addCheckListItems.mutate(
      {
        ...data,
        createdAt: Date.now(),
        done: false,
      },
      {
        onSuccess: () => setisAddItem(false),
      }
    );
  };

  const handleDeleteChecklist = async () => {
    deleteChecklist.mutate(["items"]);
  };


  useEffect(() => {
    if (checklistItems && isFetched) {
      if (checklistItems.length === 0) {
        setCompleteBarWidth(0);
      } else {
        setCompleteBarWidth(
          Math.round(
            (checklistItems.filter((item) => item.done).length * 100) /
              checklistItems.length
          )
        );
      }
    }
  }, [checklistItems, isFetched]);


  return (
    <div className="space-y-3 rounded-xl my-2 relative p-4 border-2 border-gray-200">
      <div className="w-full space-y-3">
        <div className="flex items-center justify-between gap-2 font-medium w-full">
          <div className="flex items-center gap-1">
            <ListCheck />
            <UpdateTitle name="Checklist" title={checkList.title} query={updateCheckList} headingLevel={"h4"} />
          </div>
          <DeleteItem
            name="checklist"
            isText={false}
            handleDelete={handleDeleteChecklist}
            isPending={deleteChecklist.isPending}
          />
        </div>
        <div className="flex items-center gap-4 w-full">
          <span className="inline-block h-1 flex-1 bg-gray-100 rounded-full relative overflow-hidden">
            <span
              className="inline-block h-1 bg-green-500 absolute top-[50%] -translate-y-1/2 transition-all"
              style={{ width: `${completeBarWidth}%` }}
            ></span>
          </span>
          <p className="pr-2">{completeBarWidth}%</p>
        </div>
      </div>
        {checklistItems && checklistItems.length > 0 ? (
        <div>
            {checklistItems.map((item) => (
              <TaskCheckListItem
                key={item.id}
                item={item}
                taskId={taskId}
                checklistId={checkList.id}
              />
            ))}
       </div>
        ) : (
          <p className="text-gray-300 text-center uppercase text-xs">
            No items yet
          </p>
        )}
        <AddItem
          type="Item"
          onSubmit={onSubmit}
          query={addCheckListItems}
          isOpen={isAddItem}
          setIsOpen={setisAddItem}
        />
    </div>
  );
};

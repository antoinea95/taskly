import { CheckListItemType, CheckListType } from "@/utils/types";
import { Check, X } from "lucide-react";
import { useState } from "react";
import { useGetChecklistItems } from "@/firebase/fetchHook";
import { TaskCheckListItem } from "./TaskCheckListItem";
import { AddItem } from "../Form/AddItem";
import { useAddDoc, useDeleteDoc } from "@/firebase/mutateHook";
import { Button } from "../ui/button";

export const TaskCheckList = ({
  taskId,
  checkList,
}: {
  taskId: string;
  checkList: CheckListType;
}) => {
  const { data: checklistItems } = useGetChecklistItems(taskId, checkList.id);
  const addCheckListItems = useAddDoc<CheckListItemType>(
    "checklistItems",
    `tasks/${taskId}/checklists/${checkList.id}/items`,
    checkList.id
  );
  const deleteChecklist = useDeleteDoc(
    "checklists",
    `tasks/${taskId}/checklists`,
    checkList.id,
    taskId
  );

  const [isAddItem, setisAddItem] = useState(false);

  const onSubmit = async (data: { title: string }) => {
    addCheckListItems.mutate({
      ...data,
      createdAt: Date.now(),
      done: false,
    }, {
      onSuccess: () => setisAddItem(false)
    });
  };

  const handleDeleteChecklist = async () => {
    deleteChecklist.mutate(["items"]);
  };

  return (
    <div className="flex flex-col gap-3 border rounded-xl my-4 p-3 relative">
      <h3 className="flex items-center gap-2 font-medium text-xl">
        <Check />
        {checkList.title}
      </h3>
      <Button onClick={handleDeleteChecklist} className="absolute w-fit right-3 p-0 h-fit bg-transparent text-black shadow-none">
        <X />
      </Button>
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

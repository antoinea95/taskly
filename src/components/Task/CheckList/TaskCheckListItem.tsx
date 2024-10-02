import { CheckListItemType } from "@/utils/types";
import { Checkbox } from "@/components/ui/checkbox";
import { X } from "lucide-react";
import { Button } from "../../ui/button";
import { useDeleteDoc, useUpdateDoc } from "@/firebase/mutateHook";
import { CheckedState } from "@radix-ui/react-checkbox";
import { useState } from "react";

export const TaskCheckListItem = ({
  item,
  taskId,
  checklistId,
}: {
  item: CheckListItemType;
  taskId: string;
  checklistId: string;
}) => {

  const [isDone, setIsDone] = useState(item.done);

  const updateCheckListItem = useUpdateDoc<CheckListItemType>(
    "checklistItems",
    `tasks/${taskId}/checklists/${checklistId}/items`,
    item.id,
    checklistId
  );

  const deleteCheckListItem = useDeleteDoc(
    "checklistItems",
    `tasks/${taskId}/checklists/${checklistId}/items`,
    item.id,
    checklistId
  );

  const handleCheckedChange = async (checked: CheckedState) => {
    updateCheckListItem.mutate({
      done: checked as boolean,
    }, {
      onSuccess: () => setIsDone(prev => !prev)
    });
  };

  const handleDelete = async () => {
    deleteCheckListItem.mutate([]);
  }

  return (
    <div className="flex justify-between items-center px-3 py-2 rounded-xl hover:bg-gray-50">
      <div className="flex items-center w-full">
        <Checkbox
          id={item.title}
          defaultChecked={item.done}
          className="border-2 flex items-center justify-center p-2"
          onCheckedChange={handleCheckedChange}
        />
        <label htmlFor={item.title} className={`${isDone ? "line-through" : ""} flex-1 pl-5 cursor-pointer`}>{item.title}</label>
      </div>
      <Button className="p-1 h-fit bg-transparent text-black shadow-none border-none hover:bg-red-500 hover:text-white" onClick={handleDelete}>
        <X size={16} />
      </Button>
    </div>
  );
};

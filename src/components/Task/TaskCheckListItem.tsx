import { CheckListItemType } from "@/utils/types";
import { Checkbox } from "@/components/ui/checkbox";
import { X } from "lucide-react";
import { Button } from "../ui/button";
import { useDeleteDoc, useUpdateDoc } from "@/firebase/mutateHook";
import { CheckedState } from "@radix-ui/react-checkbox";

export const TaskCheckListItem = ({
  item,
  taskId,
  checklistId,
}: {
  item: CheckListItemType;
  taskId: string;
  checklistId: string;
}) => {

  const updateCheckListItem = useUpdateDoc<CheckListItemType>(
    "checklistItems",
    `tasks/${taskId}/checklists/${checklistId}/items`,
    item.id
  );

  const deleteCheckListItem = useDeleteDoc(
    "checklistItems",
    `tasks/${taskId}/checklists/${checklistId}/items`,
    item.id
  );

  const handleCheckedChange = async (checked: CheckedState) => {
    updateCheckListItem.mutate({
      done: checked as boolean,
    });
  };

  const handleDelete = async () => {
    deleteCheckListItem.mutate([]);
  }

  return (
    <div className="flex justify-between items-center px-3 py-2 rounded-xl hover:bg-gray-50 cursor-pointer">
      <div className="flex items-center space-x-5">
        <Checkbox
          id={item.title}
          defaultChecked={item.done}
          className="border-2 flex items-center justify-center p-2"
          onCheckedChange={handleCheckedChange}
        />
        <label htmlFor={item.title}>{item.title}</label>
      </div>
      <Button className="p-1 h-fit" onClick={handleDelete}>
        <X size={16} />
      </Button>
    </div>
  );
};

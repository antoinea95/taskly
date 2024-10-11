import { CheckListItemType } from "@/components/types/tasks.types";
import { X } from "lucide-react";
import { Button } from "../../ui/button";
import { CheckedState } from "@radix-ui/react-checkbox";
import { useState } from "react";
import { useUpdateDoc } from "@/utils/hooks/FirestoreHooks/mutations/useUpdateDoc";
import { useDeleteDoc } from "@/utils/hooks/FirestoreHooks/mutations/useDeleteDoc";
import { FormCheckBoxItem } from "@/components/Form/fields/FormCheckBoxItem";

/**
 * TaskCheckListItem component representing a single checklist item within a task.
 * It includes functionality to mark the item as done or not done and to delete the item.
 * 
 * @param {Object} props - The component props.
 * @param {CheckListItemType} props.item - The checklist item data.
 * @param {string} props.taskId - The ID of the task the checklist item belongs to.
 * @param {string} props.checklistId - The ID of the checklist the item belongs to.
 * 
 * @returns The rendered TaskCheckListItem component.
 */
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

  const updateCheckListItem = useUpdateDoc<Partial<CheckListItemType>>(
    ["checklistItems", checklistId],
    `tasks/${taskId}/checklists/${checklistId}/items`,
    item.id,
  );

  const deleteCheckListItem = useDeleteDoc(
    ["checklistItems", checklistId],
    `tasks/${taskId}/checklists/${checklistId}/items`,
    item.id,
  );

  /**
   * Handle the change in the checked state of the checklist item.
   * It updates the item's `done` status in Firestore.
   * 
   * @param {CheckedState} checked - The new checked state of the item (true or false).
   */
  const handleCheckedChange = async (checked: CheckedState) => {
    updateCheckListItem.mutate({
      done: checked as boolean,
    }, {
      onSuccess: () => setIsDone(prev => !prev),
    });
  };

  /**
   * Handle the deletion of the checklist item.
   * It triggers the deletion of the item from Firestore.
   */
  const handleDelete = async () => {
    deleteCheckListItem.mutate();
  };

  return (
    <div className="flex justify-between items-center p-2 rounded-xl hover:bg-gray-100">
      <FormCheckBoxItem 
        id={item.title} 
        defaultChecked={item.done} 
        onCheckedChange={handleCheckedChange} 
        content={item.title} 
        isDone={isDone} 
      />
      <Button 
        className="p-1 h-fit bg-transparent text-black shadow-none border-none hover:bg-red-500 hover:text-white" 
        onClick={handleDelete}
      >
        <X size={16} />
      </Button>
    </div>
  );
};

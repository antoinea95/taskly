import { CheckListItemType, CheckListType } from "@/utils/types/tasks.types";
import { ListCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { TaskCheckListItem } from "./TaskCheckListItem";
import { useGetChecklistItems } from "@/utils/hooks/FirestoreHooks/queries/useGetChecklists";
import { useAddDoc } from "@/utils/hooks/FirestoreHooks/mutations/useAddDoc";
import { useUpdateDoc } from "@/utils/hooks/FirestoreHooks/mutations/useUpdateDoc";
import { useDeleteChecklist } from "@/utils/hooks/FirestoreHooks/mutations/useDeletions";
import { FieldValues } from "react-hook-form";
import { UpdateTitleForm } from "@/components/Form/UpdateTitleForm";
import { DeleteButton } from "@/components/Button/DeleteButton";
import { DeleteConfirmation } from "@/components/Form/actions/DeleteConfirmation";
import { AddForm } from "@/components/Form/AddForm";

/**
 * TaskCheckList component renders a checklist for a given task.
 * It provides functionality for adding, updating, and deleting checklist items.
 * It also calculates the completion percentage of the checklist.
 *
 * @param {Object} props - The properties for the TaskCheckList component.
 * @param {string} props.taskId - The ID of the task this checklist belongs to.
 * @param {CheckListType} props.checkList - The checklist object containing details of the checklist.
 *
 * @returns - The JSX element representing the TaskCheckList component.
 */
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
    ["checklistItems", checkList.id],
    `tasks/${taskId}/checklists/${checkList.id}/items`
  );

  const updateCheckList = useUpdateDoc<Partial<CheckListType>>(
    ["checklists", taskId],
    `tasks/${taskId}/checklists`,
    checkList.id
  );
  const deleteChecklist = useDeleteChecklist<void>(taskId, checkList.id);

  const [isAddItem, setisAddItem] = useState(false);

  /**
   * Handles the addition of a new checklist item.
   *
   * @param {FieldValues} data - The form data containing the title for the new checklist item.
   */
  const handleAddChecklist = async (data: FieldValues) => {
    addCheckListItems.mutate(
      {
        title: data.title,
        createdAt: Date.now(),
        done: false,
      },
      {
        onSuccess: () => setisAddItem(false),
      }
    );
  };

  /**
   * Handles the deletion of the checklist.
   */
  const handleDeleteChecklist = async () => {
    deleteChecklist.mutate();
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
    <div className="space-y-3 rounded-xl my-2 relative p-4 border-2 border-gray-200 dark:border-gray-800">
      <div className="w-full space-y-3">
        <div className="flex items-center justify-between font-medium w-full">
          <div className="flex items-center gap-1 dark:text-gray-300">
            <ListCheck size={20} />
            <UpdateTitleForm
              name="Checklist"
              title={checkList.title}
              mutationQuery={updateCheckList}
              headingLevel={"h3"}
            />
          </div>
          <DeleteButton>
            {({ setIsOpen }) => (
              <DeleteConfirmation
                setIsOpen={setIsOpen}
                actionName="checklist"
                handleDelete={handleDeleteChecklist}
                isPending={deleteChecklist.isPending}
              />
            )}
          </DeleteButton>
        </div>
        <div className="flex items-center gap-4 w-full">
          <span className="inline-block h-1 flex-1 bg-gray-100 rounded-full relative overflow-hidden dark:bg-gray-800">
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
        <p className="text-gray-300 text-center uppercase text-xs dark:text-gray-800">
          No items yet
        </p>
      )}
      <AddForm
        name="Item"
        onSubmit={handleAddChecklist}
        mutationQuery={addCheckListItems}
        isOpen={isAddItem}
        setIsOpen={setisAddItem}
      />
    </div>
  );
};

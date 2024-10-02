import { CheckListItemType, CheckListType } from "@/utils/types";
import { Check, ListCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { useGetChecklistItems } from "@/firebase/fetchHook";
import { TaskCheckListItem } from "./TaskCheckListItem";
import { AddItem } from "../../Form/AddItem";
import { useAddDoc, useDeleteDoc } from "@/firebase/mutateHook";
import { DeleteItem } from "../../Form/DeleteItem";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../ui/card";

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
    <Card className="flex flex-col rounded-xl my-4 relative border-none shadow-none ">
      <CardHeader className="w-full px-0 py-3">
        <CardTitle className="flex items-center justify-between gap-2 font-medium text-xl w-full">
          <h3 className="flex items-center gap-1">
            <ListCheck />
            {checkList.title}
          </h3>
          <DeleteItem
            name="checklist"
            isText={false}
            handleDelete={handleDeleteChecklist}
            isPending={deleteChecklist.isPending}
          />
        </CardTitle>
        <div className="flex items-center gap-4 w-full">
          <span className="inline-block h-1 flex-1 bg-gray-100 rounded-full relative overflow-hidden">
            <span
              className="inline-block h-1 bg-green-500 absolute top-[50%] -translate-y-1/2 transition-all"
              style={{ width: `${completeBarWidth}%` }}
            ></span>
          </span>
          <p className="pr-2">{completeBarWidth}%</p>
        </div>
      </CardHeader>
        {checklistItems && checklistItems.length > 0 ? (
        <CardContent className="bg-gray-50 rounded-xl p-3">
            {checklistItems.map((item) => (
              <TaskCheckListItem
                key={item.id}
                item={item}
                taskId={taskId}
                checklistId={checkList.id}
              />
            ))}
       </CardContent>
        ) : (
          <p className="text-gray-300 text-center uppercase text-xs">
            No items yet
          </p>
        )}
      <CardFooter className="flex flex-col items-center justify-center pt-3 px-0">
        <AddItem
          type="Item"
          onSubmit={onSubmit}
          query={addCheckListItems}
          isOpen={isAddItem}
          setIsOpen={setisAddItem}
        />
      </CardFooter>
    </Card>
  );
};

import { z } from "zod";
import { CreateForm } from "../Form/CreateForm";
import { TaskType } from "@/utils/types";
import { Dispatch, SetStateAction } from "react";
import { Button } from "../ui/button";
import { useCreateItem } from "@/utils/useCreateItem";

export const AddTask = ({
  boardId,
  listId,
  setIsAddTask,
}: {
  boardId: string;
  listId: string;
  setIsAddTask: Dispatch<SetStateAction<boolean>>;
}) => {

  const TaskSchema = z.object({
    title: z.string().min(2),
  });

  const {onSubmit, createItem} = useCreateItem<Omit<TaskType, "id">>({
    schema: TaskSchema,
    data: {
      listId: listId,
    },
    queryName: `${listId}, tasks`,
    databaseName: `boards/${boardId}/lists/${listId}/tasks`,
    setIsOpen: setIsAddTask
  })


  const formContent = [
    { name: "title", type: "text", placeholder: "Board title" },
  ];

  return (
    <div className="flex flex-col justify-center p-4 rounded-xl border-black border gap-3 w-full">
      <CreateForm
        schema={TaskSchema}
        onSubmit={onSubmit}
        formContent={formContent}
        buttonName="Create"
        query={createItem}
      />
      <Button
        className="w-full px-3 bg-red-500"
        onClick={() => setIsAddTask(false)}
      >
        Cancel
      </Button>
    </div>
  );
};

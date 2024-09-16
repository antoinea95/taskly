import { z } from "zod";
import { Form } from "../Form/Form";
import { useAddDoc } from "@/firebase/mutateHook";
import { TaskType } from "@/utils/types";
import { Dispatch, SetStateAction } from "react";
import { Button } from "../ui/button";

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

  const createTask = useAddDoc<Omit<TaskType, "id">>(
    `${listId}, tasks`,
    `boards/${boardId}/lists/${listId}/tasks`
  );

  const onSubmit = async (value: z.infer<typeof TaskSchema>) => {
    createTask.mutate({
      title: value.title,
      listId: listId,
      createdAt: Date.now(),
    });
  };

  const formContent = [
    { name: "title", type: "text", placeholder: "Board title" },
  ];

  return (
    <div className="flex flex-col justify-center p-4 rounded-xl border-black border gap-3 w-full">
      <Form
        schema={TaskSchema}
        onSubmit={onSubmit}
        formContent={formContent}
        buttonName="Create"
        isError={createTask.isError}
        isLoading={createTask.isPending}
        error={createTask.error}
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

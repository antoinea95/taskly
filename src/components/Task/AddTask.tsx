import { ListType, TaskType } from "@/utils/types";
import { Dispatch, SetStateAction } from "react";
import { useAddDoc, useUpdateDoc } from "@/firebase/mutateHook";
import { AddItem } from "../Form/AddItem";

export const AddTask = ({
  list,
  boardId,
  setIsAddTask,
}: {
  list: ListType;
  boardId: string;
  setIsAddTask: Dispatch<SetStateAction<boolean>>;
}) => {
  // Imaginons que TaskType et ListType sont tes types de données
  const createTask = useAddDoc<TaskType>("tasks", list.id);
  const updateList = useUpdateDoc<ListType>("lists", list.id, boardId);

  const onSubmit = async (data: {title: string}) => {
    createTask.mutate(
      {
        ...data,
        createdAt: Date.now(),
      },
      {
        onSuccess: (newTaskId) => { 
          updateList.mutate({
            tasks: [...list.tasks, newTaskId],
          });
          setIsAddTask(false);
        },
      }
    );
  };

  return (
    <div className="flex items-center justify-center">
      <AddItem
        type="Task"
        onSubmit={onSubmit}
        query={createTask}
        setIsOpen={setIsAddTask}
      />
    </div>
  );
};

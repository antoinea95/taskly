import { CheckListType, ListType, TaskType } from "@/utils/types";
import { TaskDescription } from "./TaskDescription";
import { useAddDoc, useDeleteDoc, useUpdateDoc } from "@/firebase/mutateHook";
import { AddItem } from "../Form/AddItem";
import { Dispatch, SetStateAction, useState } from "react";
import { TaskCheckList } from "./TaskCheckList";
import { useGetChecklists } from "@/firebase/fetchHook";
import { ScrollArea } from "../ui/scroll-area";
import { useParams } from "react-router-dom";
import { DeleteItem } from "../Form/DeleteItem";

export const TaskDetails = ({
  task,
  setIsTaskOpen,
  list,
}: {
  task: TaskType;
  setIsTaskOpen: Dispatch<SetStateAction<boolean>>;
  list: ListType;
}) => {
  const { boardId } = useParams();
  const [isAddCheckList, setIsAddCheckList] = useState(false);
  const { data: checklists, isFetched } = useGetChecklists(task.id);
  const addCheckList = useAddDoc<CheckListType>(
    "checklists",
    `tasks/${task.id}/checklists`,
    task.id
  );
  const deleteTask = useDeleteDoc("tasks", "tasks", task.id);
  const updateList = useUpdateDoc<ListType>("lists", "lists", list.id, boardId);

  const onSubmit = async (data: { title: string }) => {
    addCheckList.mutate({
      ...data,
      createdAt: Date.now(),
    });
  };

  const handleDelete = async () => {
    deleteTask.mutate(["items", "checklists"], {
      onSuccess: async () => {
        updateList.mutate({
          tasks: list.tasks.filter((taskId) => taskId !== task.id),
        });
        setIsTaskOpen(false);
      },
    });
  };

  return (
    <ScrollArea className="w-[850px] h-[75vh] p-4">
      <section className="flex items-start gap-20 h-[75vh]">
        <div className="col-span-2 flex flex-col gap-3 w-2/3">
          <TaskDescription taskId={task.id} description={task.description} />
          {checklists &&
            isFetched &&
            checklists.map((checklist) => (
              <TaskCheckList
                taskId={task.id}
                checkList={checklist}
                key={checklist.id}
              />
            ))}
        </div>
        <div className="h-full w-1/3 relative">
          <div className="rounded-xl w-full sticky top-0 right-0 flex flex-col gap-3">
            <AddItem
              type="Checklist"
              onSubmit={onSubmit}
              query={addCheckList}
              isOpen={isAddCheckList}
              setIsOpen={setIsAddCheckList}
            />
           <DeleteItem handleDelete={handleDelete} name="task" isText={true} />
          </div>
        </div>
      </section>
    </ScrollArea>
  );
};

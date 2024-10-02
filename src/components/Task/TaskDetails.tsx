import { CheckListType, ListType, TaskType } from "@/utils/types";
import { TaskDescription } from "./TaskDescription";
import { useAddDoc, useDeleteDoc, useUpdateDoc } from "@/firebase/mutateHook";
import { AddItem } from "../Form/AddItem";
import { Dispatch, SetStateAction, useState } from "react";
import { TaskCheckList } from "./CheckList/TaskCheckList";
import { useGetChecklists } from "@/firebase/fetchHook";
import { ScrollArea } from "../ui/scroll-area";
import { useParams } from "react-router-dom";
import { DeleteItem } from "../Form/DeleteItem";
import { AddTaskDueDate } from "../Form/DueDate/AddTaskDueDate";
import { TaskDueDate } from "./TaskDueDate";
import { List } from "lucide-react";
import { UpdateTitle } from "../Form/UpdateTitle";

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
  const updateTask = useUpdateDoc<TaskType>("tasks", "tasks", task.id);

  const onSubmit = async (data: { title: string }) => {
    addCheckList.mutate(
      {
        ...data,
        createdAt: Date.now(),
      },
      {
        onSuccess: () => setIsAddCheckList(false),
      }
    );
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
    <ScrollArea className="w-[850px] h-[75vh]">
      <header className="mb-3 flex flex-col p-3">
        <UpdateTitle name="Task" title={task.title} query={updateTask} headingLevel={"h2"} />
        <section className="flex items-center my-2 px-3">
          <div className="flex flex-col gap-1 w-fit">
            <p className="flex items-center gap-2 font-medium text-sm">
              <List size={14} /> List
            </p>
            <span className="text-sm font-medium flex items-center justify-between bg-gray-50  rounded-xl w-fit p-3">
              {list.title}
            </span>
          </div>
          {task.dueDate && (
            <TaskDueDate dueDate={task.dueDate} taskId={task.id} />
          )}
        </section>
      </header>
      <section className="flex items-start gap-20 h-[75vh] px-4">
        <div className="flex flex-col gap-3 w-2/3 px-3">
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
            <AddTaskDueDate task={task} />
            <AddItem
              type="Checklist"
              onSubmit={onSubmit}
              query={addCheckList}
              isOpen={isAddCheckList}
              setIsOpen={setIsAddCheckList}
            />
            <DeleteItem
              handleDelete={handleDelete}
              name="task"
              isText={true}
              isPending={deleteTask.isPending}
            />
          </div>
        </div>
      </section>
    </ScrollArea>
  );
};

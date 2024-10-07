import { BoardType, CheckListType, ListType, TaskType } from "@/utils/types";
import { TaskDescription } from "./TaskDescription";
import { useAddDoc, useDeleteDoc, useUpdateDoc } from "@/firebase/mutateHook";
import { AddItem } from "../../Form/AddItem";
import { Dispatch, SetStateAction, useState } from "react";
import { useGetDoc } from "@/firebase/fetchHook";
import { ScrollArea } from "../../ui/scroll-area";
import { useParams } from "react-router-dom";
import { DeleteItem } from "../../Form/DeleteItem";
import { AddTaskDueDate } from "../../Form/DueDate/AddTaskDueDate";
import { AddMember } from "../../Members/AddMember";
import { List, Users } from "lucide-react";
import { UpdateTitle } from "@/components/Form/UpdateTitle";
import { TaskDueDate } from "./TaskDueDate";
import { MembersDetails } from "@/components/Members/MembersDetails";
import { TaskCheckListSection } from "../CheckList/TaskCheckListSection";
import { TaskCommentsSection } from "../Comments/TaskCommentsSection";
import { useAuth } from "@/firebase/authHook";

export const TaskDetails = ({
  task,
  setIsTaskOpen,
  list,
}: {
  task: TaskType;
  setIsTaskOpen: Dispatch<SetStateAction<boolean>>;
  list: ListType;
}) => {
  const {currentUser} = useAuth();
  const { boardId } = useParams();
  const [isAddCheckList, setIsAddCheckList] = useState(false);

  // fetch data
  const board = useGetDoc<BoardType>("boards", boardId);

  // mutate hook
  const addCheckList = useAddDoc<CheckListType>(
    "checklists",
    `tasks/${task.id}/checklists`,
    task.id
  );
  const deleteTask = useDeleteDoc("task", "tasks", task.id);
  const updateList = useUpdateDoc<ListType>("lists", "lists", list.id, boardId);
  const updateTask = useUpdateDoc<TaskType>("task", "tasks", task.id);

  // add a new checklist
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

  // delete task
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
    <ScrollArea className="w-[850px] h-[80vh]">
      <header className="mb-3 flex flex-col p-3">
        <UpdateTitle
          name="Task"
          title={task.title}
          query={updateTask}
          headingLevel={"h2"}
        />
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
          {task.members && task.members.length > 0 && board.data && (
            <div className="flex flex-col gap-1 w-fit animate-fade-in">
              <p className="flex items-center gap-2 font-medium text-sm">
                <Users size={14} /> Members
              </p>
              <div className="bg-gray-50 rounded-xl h-11 flex items-center justify-center p-3">
              <MembersDetails members={task.members} query={updateTask} />
              </div>
            </div>
          )}
        </section>
      </header>
      <section className="grid grid-cols-5 grid-rows-2 gap-5 px-4 h-fit">
        <div className="flex flex-col gap-3 col-span-3 px-3">
          <TaskDescription query={updateTask} description={task.description} />
          <TaskCheckListSection taskId={task.id} />
        </div>
        <div className="h-fit col-span-2 relative">
          <div className="rounded-xl w-full sticky top-0 right-0 flex flex-col gap-3">
            {board.data && (
              <AddMember
                members={task.members ? task.members : []}
                queryName="tasks"
                queryId={task.id}
                query={updateTask}
                board={board.data}
              />
            )}
            <AddTaskDueDate task={task} query={updateTask} />
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
        {currentUser && <TaskCommentsSection comments={task.comments} query={updateTask} userId={currentUser.id} />}
      </section>
    </ScrollArea>
  );
};

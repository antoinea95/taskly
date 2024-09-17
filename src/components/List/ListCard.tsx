import { ListType } from "@/utils/types";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "../ui/card";
import { useDeleteDoc } from "@/firebase/mutateHook";
import { Button } from "../ui/button";
import { Plus, X } from "lucide-react";
import { useState } from "react";
import { AddTask } from "../Task/AddTask";
import { useFetchTasks } from "@/firebase/fetchHook";
import { TaskCard } from "../Task/TaskCard";
import { UpdateForm } from "../Form/UpdateForm";

export const ListCard = ({
  list,
  boardId,
}: {
  list: ListType;
  boardId: string;
}) => {
  const deleteList = useDeleteDoc(
    `${boardId}, lists`,
    `boards/${boardId}/lists`,
    list.id,
    ["tasks"]
  );
  const [isAddTask, setIsAddTask] = useState(false);
  const [isListNameUpdate, setIsListNameUpdate] = useState(false);
  const tasks = useFetchTasks(boardId, list.id);

  if (tasks.isLoading) {
    return <p>...</p>;
  }

  if (tasks.isError) {
    return <p>Error</p>;
  }

  const tasksData = tasks.data
    ? tasks.data
        .filter((task) => task.listId === list.id)
        .sort((a, b) => b.createdAt - a.createdAt)
    : [];

  return (
    <Card className="flex-1 min-w-72 min-h-32 z-10">
      <CardHeader className="flex  flex-row items-center justify-between">
          <UpdateForm
            queryName={`${boardId}, lists`}
            databaseName={`boards/${boardId}/lists`}
            id={list.id}
            value={list.title}
            isUpdate={isListNameUpdate}
            setIsUpdate={setIsListNameUpdate}
          />
      
        <Button
          onClick={() => deleteList.mutate()}
          className="w-5 h-5 p-0 bg-transparent border-none shadow-none"
        >
          <X size={20} className="text-black" />
        </Button>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {tasksData.length === 0 ? (
          <p>No task yet</p>
        ) : (
          tasksData.map((task) => <TaskCard task={task} key={task.id} listId={list.id} boardId={boardId} />)
        )}
      </CardContent>
      <CardFooter>
        {isAddTask ? (
          <AddTask
            boardId={boardId}
            listId={list.id}
            setIsAddTask={setIsAddTask}
          />
        ) : (
          <Button className="w-full" onClick={() => setIsAddTask(true)}>
            <Plus size={16} className="mr-2" />
            Add a task
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

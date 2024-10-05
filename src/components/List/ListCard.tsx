import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { useMemo, useState } from "react";
import { ListType, TaskType } from "@/utils/types";
import { useDroppable } from "@dnd-kit/core";
import { TaskCard } from "../Task/TaskCard";
import { AddItem } from "../Form/AddItem";
import {
  useAddDoc,
  useDeleteDoc,
  useUpdateDoc,
} from "@/firebase/mutateHook";
import { DeleteItem } from "../Form/DeleteItem";
import { UpdateTitle } from "../Form/UpdateTitle";

export const ListCard = ({
  list,
  boardId,
}: {
  list: ListType;
  boardId: string;
}) => {
  const [isAddTask, setIsAddTask] = useState(false);
  const { setNodeRef } = useDroppable({ id: list.id, data: { type: "list" } });

  const memoizedTasks = useMemo(() => {
    return list?.tasks.map((taskId) => (
      <TaskCard key={taskId} taskId={taskId} list={list} />
    ));
  }, [list]);

  const createTask = useAddDoc<TaskType>("tasks", "tasks", list.id);
  const updateList = useUpdateDoc<ListType>("lists", "lists", list.id, boardId);
  const deleteList = useDeleteDoc("lists", "lists", list.id, boardId);

  const onSubmit = async (data: { title: string }) => {
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

  const handleDelete = async () => {
    deleteList.mutate([]);
  };

  return (
    <div ref={setNodeRef} className="h-fit min-w-72 w-fit px-3">
      {list && (
        <Card className="shadow-none h-fit border-none bg-transparent min-h-96">
          <CardHeader className="p-0 flex flex-col gap-3">
            <CardTitle className="text-xl font-normal flex items-center justify-between">
              <UpdateTitle name="List" title={list.title} query={updateList} headingLevel={"h3"} />
              <DeleteItem
                name="list"
                handleDelete={handleDelete}
                isText={false}
                isPending={deleteList.isPending}
              />
            </CardTitle>
            <AddItem
              type="Task"
              onSubmit={onSubmit}
              query={createTask}
              isOpen={isAddTask}
              setIsOpen={setIsAddTask}
            />
          </CardHeader>
          <CardContent className="flex flex-col gap-3 pt-3 px-0">
            {memoizedTasks}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

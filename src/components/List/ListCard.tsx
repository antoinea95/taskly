import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { useEffect, useMemo, useState } from "react";
import { AddTask } from "../Task/AddTask";
import { ListType } from "@/utils/types";
import { useDroppable } from "@dnd-kit/core";
import { TaskCard } from "../Task/TaskCard";

export const ListCard = ({
  list,
  boardId,
}: {
  list: ListType;
  boardId: string;
}) => {
  const [isAddTask, setIsAddTask] = useState(false);

  const { setNodeRef } = useDroppable({ id: list.id, data: { type: "list" } });
  const taskIds = list.tasks;

  const memoizedTasks = useMemo(() => {
    return taskIds.map((taskId) => (
      <TaskCard key={taskId} taskId={taskId} />
    ));
  }, [taskIds]);

  return (
    <div ref={setNodeRef}>
      <Card className="min-h-32 shadow-none">
        <CardHeader className="flex  flex-row items-center justify-between">
          <CardTitle>{list.title}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <div className="flex-1 min-w-72">
            {memoizedTasks}
          </div>
        </CardContent>
        <CardFooter>
          {!isAddTask ? (
            <Button onClick={() => setIsAddTask(true)} className="w-full">
              Add a task
            </Button>
          ) : (
            <AddTask
              list={list}
              boardId={boardId}
              setIsAddTask={setIsAddTask}
            />
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

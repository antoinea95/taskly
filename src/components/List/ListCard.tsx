import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { useMemo, useState } from "react";
import { AddTask } from "../Task/AddTask";
import { ListType } from "@/utils/types";
import { useDroppable } from "@dnd-kit/core";
import { TaskCard } from "../Task/TaskCard";
import { Plus } from "lucide-react";
import { Modal } from "../ui/Modal";

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
    return taskIds.map((taskId) => <TaskCard key={taskId} taskId={taskId} />);
  }, [taskIds]);

  return (
    <div ref={setNodeRef} className="h-fit min-w-72 w-fit">
      <Card className="shadow-none h-fit border-none bg-transparent">
        <CardHeader className="p-0">
          <CardTitle className="text-xl font-normal">{list.title}</CardTitle>
          <Modal
            setIsModalOpen={setIsAddTask}
            isModalOpen={isAddTask}
            dialogName={`${list.title}: new task`}
          >
            <Button
              onClick={() => setIsAddTask(true)}
              className="w-full py-6 rounded-xl bg-white text-black flex gap-2 shadow-none border-none hover:text-lg hover:bg-white transition-all ease-in-out"
            >
              <Plus size={17} />
              Add a task
            </Button>
            <AddTask
              list={list}
              boardId={boardId}
              setIsAddTask={setIsAddTask}
            />
          </Modal>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 pt-3 px-0">
          {memoizedTasks}
        </CardContent>
      </Card>
    </div>
  );
};

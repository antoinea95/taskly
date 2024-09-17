import { TaskType } from "@/utils/types";
import { useState } from "react";
import { Modal } from "../ui/Modal";
import { Card, CardTitle } from "../ui/card";
import { UpdateForm } from "../Form/UpdateForm";

export const TaskCard = ({ task, listId, boardId }: { task: TaskType, listId: string, boardId: string }) => {
  const [isTaskOpen, setIsTaskOpen] = useState(false);
  const [isTaskNameUpdate, setIsTaskNameUpdate] = useState(false);

  return (
    <Modal
      Trigger={
        <Card className="py-3 px-2 min-h-12 cursor-pointer hover:bg-gray-200" onClick={() => setIsTaskOpen(true)}>
          <CardTitle>{task.title}</CardTitle>
        </Card>
      }
      dialogName={
          <UpdateForm 
            queryName={`${listId}, tasks`}
            databaseName={`boards/${boardId}/lists/${listId}/tasks`}
            id={task.id}
            value={task.title}
            isUpdate={isTaskNameUpdate}
            setIsUpdate={setIsTaskNameUpdate}
          />
      }
      setIsModalOpen={setIsTaskOpen}
      isModalOpen={isTaskOpen}
    />
  );
};
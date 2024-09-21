import { useState } from "react";
import { Modal } from "../ui/Modal";
import { Card, CardTitle } from "../ui/card";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useGetTask } from "@/firebase/fetchHook";
import { Loader } from "../ui/loader";

export const TaskCard = ({ taskId }: { taskId: string }) => {
  const [isTaskOpen, setIsTaskOpen] = useState(false);

  const { data: task, isLoading, isError } = useGetTask(taskId);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({
    id: taskId,
    data: { type: "task" },
  });


  if (isLoading) {
    return <Loader data={{ color: "white", size: "3rem" }} />;
  }

  if (isError) {
    return <p>Error</p>;
  }

  return (
    <div
      className="p-2"
      ref={setNodeRef}
      >
      {task && (
        <>
          <Modal
            dialogName={task.title}
            setIsModalOpen={setIsTaskOpen}
            isModalOpen={isTaskOpen}
          >
              <Card
            className="py-3 px-2 min-h-12 cursor-pointer hover:bg-gray-200"
            style={{
              transform: CSS.Transform.toString(transform),
              transition,
              opacity: isDragging ? 0.3 : 1,
            }}
            {...attributes}
            {...listeners}
          >
            <CardTitle>{!isDragging && task.title}</CardTitle>
          </Card>
            <div>Super</div>
          </Modal>
        
        </>
      )}
    </div>
  );
};
import { useState } from "react";
import { Modal } from "../ui/Modal";
import { Card, CardHeader, CardTitle } from "../ui/card";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useGetTask } from "@/firebase/fetchHook";

export const TaskCard = ({ taskId }: { taskId: string }) => {
  const [isTaskOpen, setIsTaskOpen] = useState(false);
  const { data: task, isFetched } = useGetTask(taskId);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: taskId,
    data: { type: "task" },
  });

  if(!isFetched) {
    return null;
  }

  return (
    <div  ref={setNodeRef}>
        {task && <>
          <Modal
            dialogName={task.title}
            setIsModalOpen={setIsTaskOpen}
            isModalOpen={isTaskOpen}
          >
            <Card
              className="border-none shadow-none rounded-xl px-3 pb-6"
              style={{
                transform: CSS.Transform.toString(transform),
                transition,
                opacity: isDragging ? 0.3 : 1,
              }}
              {...attributes}
              {...listeners}
            >
              <CardHeader className="px-0 pt-3 pb-0">
                <CardTitle className="w-fit text-lg font-normal">{task.title}</CardTitle>
              </CardHeader>
            </Card>
            <div>Super</div>
          </Modal>
        </>}
    </div>
  );
};

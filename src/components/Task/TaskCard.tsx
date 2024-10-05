import { useState } from "react";
import { Modal } from "../ui/Modal";
import { Card, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useGetDoc } from "@/firebase/fetchHook";
import { TaskDetails } from "./TaskDetails/TaskDetails";
import { ListType, TaskType } from "@/utils/types";
import { MembersAvatarList } from "../Members/MembersAvatarList";
import { Member } from "../Members/Member";
import { TaskDueDate } from "./TaskDetails/TaskDueDate";
import { TaskCheckListSection } from "./CheckList/TaskCheckListSection";

export const TaskCard = ({
  taskId,
  list,
}: {
  taskId: string;
  list: ListType;
}) => {

  const [isTaskOpen, setIsTaskOpen] = useState(false);
  const { data: task, isFetched } = useGetDoc<TaskType>("tasks", taskId);

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

  if (!isFetched) {
    return null;
  }

  return (
    <div ref={setNodeRef}>
      {task && (
        <>
          <Modal
            title={task.title}
            setIsModalOpen={setIsTaskOpen}
            isModalOpen={isTaskOpen}
          >
            <Card
              className="border-none shadow-none rounded-xl p-3 space-y-3"
              style={{
                transform: CSS.Transform.toString(transform),
                transition,
                opacity: isDragging ? 0.3 : 1,
                cursor: "grab",
              }}
              {...attributes}
              {...listeners}
            >
              <CardHeader className="p-0 space-y-3">
                <CardTitle className="w-fit text-lg font-normal leading-3">
                  {task.title}
                </CardTitle>
                {task.description && <p className="text-xs w-full line-clamp-3">{task.description}</p>}
              </CardHeader>
              <CardFooter className="flex items-center justify-between p-0">
                {task.dueDate && <TaskDueDate dueDate={task.dueDate} taskId={task.id} isCard />}
                <TaskCheckListSection taskId={task.id} isCard={true} />
                {task.members && task.members.length > 0 && (
                  <MembersAvatarList members={task.members}>
                    {task.members.slice(0, 5).map((member) => (
                      <Member key={member} userId={member} type="avatar" />
                    ))}
                  </MembersAvatarList>
                )}
              </CardFooter>
            </Card>
            <TaskDetails
              task={task}
              setIsTaskOpen={setIsTaskOpen}
              list={list}
            />
          </Modal>
        </>
      )}
    </div>
  );
};

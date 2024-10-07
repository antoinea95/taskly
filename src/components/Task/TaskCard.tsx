import { useState } from "react";
import { Modal } from "../ui/Modal";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useGetDoc } from "@/firebase/fetchHook";
import { TaskDetails } from "./TaskDetails/TaskDetails";
import { ListType, TaskType } from "@/utils/types";
import { MembersAvatarList } from "../Members/MembersAvatarList";
import { Member } from "../Members/Member";
import { TaskDueDate } from "./TaskDetails/TaskDueDate";
import { TaskCheckListSection } from "./CheckList/TaskCheckListSection";
import { Tag } from "./Tag";
import { MessageSquare } from "lucide-react";
import { Label } from "./Label/Label";

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
              <CardHeader className="p-0 flex flex-row items-center justify-between flex-wrap">
                <CardTitle className="w-fit text-lg font-normal leading-3 py-1">
                  {task.title}
                </CardTitle>
                {task.labels && task.labels.length > 0 && (
                  <section className="flex items-center gap-2 flex-wrap py-1">
                    {task.labels.map((label, index) => (
                      <Label key={index} label={label} labels={task.labels} />
                    ))}
                  </section>
                )}
              </CardHeader>
              <CardContent className="px-0 py-0 min-h-10">
                {task.description && (
                  <p className="text-xs w-full line-clamp-3">
                    {task.description}
                  </p>
                )}
              </CardContent>
              <CardFooter className="flex items-center flex-wrap gap-2 p-0">
                {task.dueDate && (
                  <TaskDueDate dueDate={task.dueDate} taskId={task.id} isCard />
                )}
                <TaskCheckListSection taskId={task.id} isCard={true} />
                {task.comments && task.comments.length > 0 && (
                  <Tag color="#9ca3af">
                    <MessageSquare size={12} />
                    {task.comments.length}
                  </Tag>
                )}
                {task.members && task.members.length > 0 && (
                  <div className="flex-1">
                    <MembersAvatarList members={task.members}>
                      {task.members.slice(0, 5).map((member) => (
                        <Member key={member} userId={member} type="avatar" />
                      ))}
                    </MembersAvatarList>
                  </div>
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

import { useState } from "react";
import { Modal } from "../../ui/Modal";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../ui/card";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {TaskType } from "@/utils/types/tasks.types";
import { ListType } from "@/utils/types/lists.types";
import { MessageSquare } from "lucide-react";
import { useGetDoc } from "@/utils/hooks/FirestoreHooks/queries/useGetDoc";
import { TaskLabel } from "../Label/TaskLabel";
import { TaskDeadline } from "../Deadline/TaskDeadline";
import { TaskCheckListSection } from "../CheckList/TaskCheckListSection";
import { Label } from "@/components/Label/Label";
import { MembersAvatarList } from "@/components/Members/MembersAvatarList";
import { Member } from "@/components/Members/Member";
import { TaskDetails } from "../TaskDetails/TaskDetails";

/**
 * TaskCard component that displays a detailed task card with labels, description, checklist, members, and other task details.
 *
 * @param {Object} props - The component props.
 * @param {string} props.taskId - The ID of the task to display.
 * @param {ListType} props.list - The list to which the task belongs.
 *
 * @returns The rendered task card component.
 */
export const TaskCard = ({
  taskId,
  list,
}: {
  taskId: string;
  list: ListType;
}) => {
  const [isTaskOpen, setIsTaskOpen] = useState(false); // State to manage modal visibility
  const { data: task, isFetched } = useGetDoc<TaskType>("tasks", taskId); // Fetch task data

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

  // If the task is still being fetched, return null
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
              {/* Task Header */}
              <CardHeader className="p-0 flex flex-row items-center justify-between flex-wrap">
                <CardTitle className="w-fit text-lg font-normal leading-3 py-1">
                  {task.title}
                </CardTitle>
                {/* Task Labels */}
                {task.labels && task.labels.length > 0 && (
                  <section className="flex items-center gap-2 flex-wrap py-1">
                    {task.labels.map((label, index) => (
                      <TaskLabel key={index} label={label} labels={task.labels} />
                    ))}
                  </section>
                )}
              </CardHeader>

              {/* Task Content */}
              <CardContent className="px-0 py-0 min-h-10">
                {task.description && (
                  <p className="text-xs w-full line-clamp-3">
                    {task.description}
                  </p>
                )}
              </CardContent>

              {/* Task Footer */}
              <CardFooter className="flex items-center flex-wrap gap-2 p-0">
                {/* Due Date */}
                {task.dueDate && (
                  <TaskDeadline dueDate={task.dueDate} taskId={task.id} isCard />
                )}
                {/* Task Checklist */}
                <TaskCheckListSection taskId={task.id} isCard={true} />
                {/* Comments Section */}
                {task.comments && task.comments.length > 0 && (
                  <Label color="#d1d5db">
                    <MessageSquare size={12} />
                    {task.comments.length}
                  </Label>
                )}
                {/* Members Avatars */}
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
            {/* Task Details Modal */}
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

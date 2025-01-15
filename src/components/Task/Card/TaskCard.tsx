import { Modal } from "../../ui/Modal";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../../ui/card";
import { TaskType } from "@/utils/types/tasks.types";
import { ListType } from "@/utils/types/lists.types";
import { MessageSquare, Paperclip } from "lucide-react";
import { TaskLabel } from "../Label/TaskLabel";
import { TaskDeadline } from "../Deadline/TaskDeadline";
import { TaskCheckListSection } from "../CheckList/TaskCheckListSection";
import { Label } from "@/components/Label/Label";
import { MembersAvatarList } from "@/components/Members/MembersAvatarList";
import { Member } from "@/components/Members/Member";
import { TaskDetails } from "../TaskDetails/TaskDetails";
import { DraggableContainer } from "@/components/DragAndDrop/DraggableContainer";
import { useEffect, useState } from "react";

/**
 * TaskCard component that displays a detailed task card with labels, description, checklist, members, and other task details.
 *
 * @param {Object} props - The component props.
 * @param {string} props.taskId - The ID of the task to display.
 * @param {ListType} props.list - The list to which the task belongs.
 *
 * @returns The rendered task card component.
 */
export const TaskCard = ({ task, list }: { task: TaskType; list: ListType }) => {

  const [ isTaskOpen, setIsTaskOpen ]= useState(false);


  // Create a custom event to trigger a event when the modal is Open
  useEffect(() => {
    const event = new CustomEvent("modalChange", {
      detail: { isOpen: isTaskOpen },
    });
    window.dispatchEvent(event);
  }, [isTaskOpen]);

  return (
    <DraggableContainer id={task.id} type="task">
      {task && (
        <>
          <Modal title={task.title} setIsModalOpen={setIsTaskOpen} isModalOpen={isTaskOpen}>
            <Card className="border-none rounded-xl dark:bg-gray-800 dark:text-gray-300 animate-top-to-bottom">
              {/* Task Header */}
              <CardHeader>
                <CardTitle>{task.title}</CardTitle>
                {/* Task Labels */}
                <section className="flex items-center gap-1 flex-wrap">
                  {task.labels &&
                    task.labels.length > 0 &&
                    task.labels.map((label, index) => <TaskLabel key={index} label={label} labels={task.labels} />)}
                </section>
              </CardHeader>

              {/* Task Content */}
              <CardContent>{task.description && <p className="text-xs w-full line-clamp-3">{task.description}</p>}</CardContent>

              {/* Task Footer */}
              <CardFooter className="flex gap-2">
                {/* Due Date */}
                {task.dueDate && <TaskDeadline dueDate={task.dueDate} taskId={task.id} isCard />}
                {/* Task Checklist */}
                <TaskCheckListSection taskId={task.id} isCard={true} />
                {/* Comments Section */}
                {task.comments && task.comments.length > 0 && (
                  <Label color="#d1d5db">
                    <MessageSquare size={12} />
                    {task.comments.length}
                  </Label>
                )}
                {/* Comments Section */}
                {task.files && task.files.length > 0 && (
                  <Label color="#d1d5db">
                    <Paperclip size={12} />
                    {task.files.length}
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
            <TaskDetails task={task} setIsTaskOpen={setIsTaskOpen} list={list} />
          </Modal>
        </>
      )}
    </DraggableContainer>
  );
};

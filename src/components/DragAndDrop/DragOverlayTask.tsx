import { TaskType } from "@/utils/types/tasks.types";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { TaskLabel } from "../Task/Label/TaskLabel";
import { TaskDeadline } from "../Task/Deadline/TaskDeadline";
import { TaskCheckListSection } from "../Task/CheckList/TaskCheckListSection";
import { MessageSquare } from "lucide-react";
import { MembersAvatarList } from "../Members/MembersAvatarList";
import { Member } from "../Members/Member";
import { Label } from "../Label/Label";

/**
 * A visual representation of a draggable task overlay for use during drag-and-drop interactions.
 * This component is displayed as an animated "ghost" of the task while it is being dragged.
 *
 * @param {TaskType} props.task - The task object containing details like title, description, labels, and members.
 *
 */
export const DragOverlayTask = ({ task }: { task: TaskType }) => {
  return (
    <Card className="border-none rounded-xl dark:bg-gray-800 dark:text-gray-300 animate-top-to-bottom opacity-90 shadow-xl transform scale-105 transition-all duration-300 ease-in-out">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">{task.title}</CardTitle>
        <section className="flex items-center gap-1 flex-wrap">
          {task.labels && task.labels.length > 0 && task.labels.map((label, index) => <TaskLabel key={index} label={label} labels={task.labels} />)}
        </section>
      </CardHeader>
      <CardContent>{task.description && <p className="text-xs text-gray-400 w-full line-clamp-3">{task.description}</p>}</CardContent>
      <CardFooter className="flex gap-2 items-center justify-between">
        {task.dueDate && <TaskDeadline dueDate={task.dueDate} taskId={task.id} isCard />}
        <TaskCheckListSection taskId={task.id} isCard={true} />
        {task.comments && task.comments.length > 0 && (
          <Label color="#d1d5db">
            <MessageSquare size={14} />
            {task.comments.length}
          </Label>
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
  );
};

import { CheckedState } from "@radix-ui/react-checkbox";
import {
  CalendarIcon,
  Check,
  Clock,
  OctagonAlert,
  TriangleAlert,
} from "lucide-react";
import { format } from "date-fns";
import { TaskHeaderItem } from "../Containers/TaskHeaderItem";
import { DateRange, TaskType } from "@/utils/types/tasks.types";
import { useUpdateDoc } from "@/utils/hooks/FirestoreHooks/mutations/useUpdateDoc";
import { Label } from "@/components/Label/Label";
import { FormCheckBoxItem } from "@/components/Form/fields/FormCheckBoxItem";

/**
 * Renders the task deadline component, which displays the due date of a task 
 * and provides an option to mark the task as completed.
 *
 * @param {Object} props - Component props
 * @param {string} props.taskId - The ID of the task
 * @param {DateRange} props.dueDate - The due date of the task with a 'from' and 'to' date
 * @param {boolean} [props.isCard] - Flag indicating if the component is being used inside a card layout
 * @returns The TaskDeadline component
 */
export const TaskDeadline = ({
  taskId,
  dueDate,
  isCard,
}: {
  taskId: string;
  dueDate: DateRange;
  isCard?: boolean;
}) => {
  const updateTask = useUpdateDoc<Partial<TaskType>>(
    ["task", taskId],
    "tasks",
    taskId
  );

  /**
   * Handles the checkbox state change for marking a task as completed or not.
   *
   * @param {CheckedState} checked - The new checked state of the checkbox
   */
  const handleCheckedChange = async (checked: CheckedState) => {
    updateTask.mutate({
      dueDate: {
        ...dueDate,
        completed: checked as boolean,
      },
    });
  };

  /**
   * Formats a date string into "d MMM. yyyy" format.
   *
   * @param {string} date - The date string to format
   * @returns The formatted date
   */
  const formatDate = (date: string) => {
    const convertDate = new Date(date);
    return `${format(convertDate, "d MMM. yyyy")}`;
  };

  /**
   * Determines the label and style for the task deadline based on the due date
   * and whether the task is completed, late, or urgent.
   *
   * @returns The label for the task deadline or null if no tag is needed
   */
  const getTag = () => {
    if (dueDate.completed) {
      return (
        <Label color="#4ade80">
          <Check size={14} />
          Completed
        </Label>
      );
    } else {
      const today = new Date();
      const dueDateObj = new Date(dueDate.to);
      const diffDays = Math.floor(
        (dueDateObj.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
      );
      const formatDueDate = format(dueDateObj, "dd MMM.");

      if (diffDays < 0) {
        return (
          <Label color="#f87171">
            <OctagonAlert size={12} />
            {isCard ? formatDueDate : "Late"}
          </Label>
        );
      } else if (diffDays <= 3) {
        return (
          <Label color="#fb923c">
            <TriangleAlert size={12} />
            {isCard ? formatDueDate : "Urgent"}
          </Label>
        );
      } else {
        return isCard ? (
          <Label color="#d1d5db">
            <Clock size={12} />
            {formatDueDate}
          </Label>
        ) : null;
      }
    }
  };

  if (isCard) {
    return <div className="flex items-center">{getTag()}</div>;
  }

  return (
    <TaskHeaderItem title="Deadline" icon={CalendarIcon} isAction>
      <FormCheckBoxItem
        id="completed"
        defaultChecked={dueDate.completed}
        onCheckedChange={handleCheckedChange}
      >
        <label
        htmlFor="completed"
        className={`pl-1 cursor-pointer text-xs font-medium mr-1 ${dueDate.completed ? "line-through" : ""}`}
      >
        {dueDate.from && `${formatDate(dueDate.from)} - `} {formatDate(dueDate.to)}
      </label>
      </FormCheckBoxItem>
      {getTag()}
    </TaskHeaderItem>
  );
};

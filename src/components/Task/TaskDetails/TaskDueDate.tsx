import { DateRange, TaskType } from "@/utils/types";
import { Checkbox } from "@/components/ui/checkbox";
import { useUpdateDoc } from "@/firebase/mutateHook";
import { CheckedState } from "@radix-ui/react-checkbox";
import {
  CalendarIcon,
  Check,
  Clock,
  OctagonAlert,
  TriangleAlert,
} from "lucide-react";
import { format } from "date-fns";
import { Tag } from "../Tag";
import { TaskHeaderItem } from "../TaskHeaderItem";

export const TaskDueDate = ({
  taskId,
  dueDate,
  isCard,
}: {
  taskId: string;
  dueDate: DateRange;
  isCard?: boolean;
}) => {
  const updateTask = useUpdateDoc<TaskType>("task", "tasks", taskId);

  const handleCheckedChange = async (checked: CheckedState) => {
    updateTask.mutate({
      dueDate: {
        ...dueDate,
        completed: checked as boolean,
      },
    });
  };

  const formatDate = (date: string) => {
    const convertDate = new Date(date);

    const formattedDate = `${format(convertDate, "d MMM. yyyy")}`;
    return formattedDate;
  };

  const getTag = () => {
    if (dueDate.completed) {
      return (
        <Tag color="#4ade80">
          <Check size={14} />
          Completed
        </Tag>
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
          <Tag color="#f87171">
            <OctagonAlert size={12} />
            {isCard ? formatDueDate : "Late"}
          </Tag>
        );
      } else if (diffDays <= 3) {
        return (
          <Tag color="#fb923c">
            <TriangleAlert size={12} />
            {isCard ? formatDueDate : "Urgent"}
          </Tag>
        );
      } else {
        return isCard ? (
          <Tag color="#9ca3af">
            <Clock size={12} />
            {formatDueDate}
          </Tag>
        ) : null;
      }
    }
  };

  if (isCard) {
    return <div className="flex items-center">{getTag()}</div>;
  }

  return (
    <TaskHeaderItem title="Deadline" icon={CalendarIcon} isAction>
      <Checkbox
        id="completed"
        defaultChecked={dueDate.completed}
        onCheckedChange={handleCheckedChange}
        className="border-2 shadow-none flex items-center justify-center"
      />
      <div className="flex items-center">
        <label
          htmlFor="completed"
          className="pl-1 cursor-pointer text-xs font-medium mr-1"
        >
          {dueDate.from && `${formatDate(dueDate.from)} - `}
          {formatDate(dueDate.to)}
        </label>
      </div>
      {getTag()}
    </TaskHeaderItem>
  );
};

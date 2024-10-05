import { DateRange, TaskType } from "@/utils/types";
import { Checkbox } from "@/components/ui/checkbox";
import { useUpdateDoc } from "@/firebase/mutateHook";
import { CheckedState } from "@radix-ui/react-checkbox";
import { CalendarIcon, Check, OctagonAlert, TriangleAlert } from "lucide-react";
import { format } from "date-fns";
import { Tag } from "../Tag";

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
        <Tag color="green">
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
      const formatDueDate = format(dueDateObj, "dd MMM.")

      if (diffDays < 0) {
        return (
          <Tag color="red">
            <OctagonAlert size={14} />
            {isCard ? formatDueDate : "Late"}
          </Tag>
        );
      } else if (diffDays <= 3) {
        return (
          <Tag color="orange">
            <TriangleAlert size={14} />
            {isCard ? formatDueDate : "Urgent"}
          </Tag>
        );
      } else {
        return isCard ? (
          <Tag color="gray">{formatDueDate} </Tag>
        ) : null;
      }
    }
  };

  if (isCard) {
    return <div className="flex items-center">{getTag()}</div>;
  }

  return (
    <div className="flex flex-col px-3 gap-1">
      <h3 className="flex items-center gap-2 font-medium text-sm">
        <CalendarIcon size={14} /> Deadline
      </h3>
      <div className="flex items-center justify-between bg-gray-50 rounded-xl w-fit p-3 hover:bg-gray-100">
        <Checkbox
          id="completed"
          defaultChecked={dueDate.completed}
          onCheckedChange={handleCheckedChange}
          className="border-2 shadow-none flex items-center justify-center"
        />
        <div className="flex items-center">
          <label
            htmlFor="completed"
            className="pl-3 cursor-pointer text-sm font-medium mr-4"
          >
            {dueDate.from && `${formatDate(dueDate.from)} - `}
            {formatDate(dueDate.to)}
          </label>
        </div>
        {getTag()}
      </div>
    </div>
  );
};

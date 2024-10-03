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
}: {
  taskId: string;
  dueDate: DateRange;
}) => {
  const updateTask = useUpdateDoc<TaskType>("tasks", "tasks", taskId);

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

      if (diffDays < 0) {
        return (
          <Tag color="orange">
            <OctagonAlert size={14} />
            Late
          </Tag>
        );
      } else if (diffDays <= 3) {
        return (
          <Tag color="orange">
            <TriangleAlert size={14} />
            Urgent
          </Tag>
        );
      } else {
        return null;
      }
    }
  };

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
          <label htmlFor="completed" className="pl-3 cursor-pointer text-sm font-medium mr-4">
           {dueDate.from && `${formatDate(dueDate.from)} - `}{formatDate(dueDate.to)}
          </label>
        </div>
        {getTag()}
      </div>
    </div>
  );
};

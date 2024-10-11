import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { Label } from "../../Label/Label";
import { TaskTagType, TaskType } from "@/components/types/tasks.types";
import { MutationResultType } from "@/components/types/form.types";

/**
 * Component to display a task label and optionally allow the user to delete the label.
 *
 * @param {Object} props - Component props
 * @param {TaskTagType[]} [props.labels] - Array of current task labels
 * @param {TaskTagType} props.label - The label to display
 * @param {MutationResultType<string, Partial<TaskType>>} [props.mutationQuery] - Mutation function for deleting the label from the task
 * @returns The TaskLabel component
 */
export const TaskLabel = ({
  labels,
  label,
  mutationQuery,
}: {
  labels?: TaskTagType[];
  label: TaskTagType;
  mutationQuery?: MutationResultType<string, Partial<TaskType>>;
}) => {
  /**
   * Handles the deletion of a label from the task.
   * Filters out the selected label from the list of task labels and updates the task using the mutationQuery.
   */
  const handleDelete = () => {
    if (labels && mutationQuery) {
      const deletedLabel = labels.find(
        (item) => item.title === label.title && item.color === label.color
      );
      if (deletedLabel) {
        mutationQuery.mutate({
          labels: labels.filter((item) => item !== deletedLabel),
        });
      }
    }
  };

  return (
    <Label color={label.color}>
      {label.title}
      {mutationQuery && (
        <Button
          onClick={handleDelete}
          className="h-fit w-fit p-0 shadow-none bg-transparent text-black hover:bg-transparent"
        >
          <X size={12} />
        </Button>
      )}
    </Label>
  );
};

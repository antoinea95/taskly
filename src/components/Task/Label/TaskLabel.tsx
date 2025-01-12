import { TaskTagType, TaskType } from "@/utils/types/tasks.types";
import { MutationResultType } from "@/utils/types/form.types";
import { TagButton } from "@/components/Filters/TagButton";

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
    <TagButton tag={label} handleSelectedTags={handleDelete} />
  );
};

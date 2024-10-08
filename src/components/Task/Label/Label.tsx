import { Button } from "@/components/ui/button";
import { TaskTagType, TaskType } from "@/utils/types";
import { UseMutationResult } from "@tanstack/react-query";
import { X } from "lucide-react";
import { Tag } from "../Tag";

export const Label = ({
  labels,
  label,
  query,
}: {
  labels?: TaskTagType[];
  label: TaskTagType;
  query?: UseMutationResult<any, unknown, Partial<TaskType> | undefined>;
}) => {
  const handleDelete = () => {
    if (labels && query) {
      const deletedLabel = labels.find(
        (item) => item.title === label.title && item.color === item.color
      );
      if (deletedLabel) {
        query.mutate({
          labels: labels.filter((item) => item !== deletedLabel),
        });
      }
    }
  };

  return (
    <Tag color={label.color}>
      {label.title}
      {query && (
        <Button
          onClick={handleDelete}
          className="h-fit w-fit p-0 shadow-none bg-transparent text-black hover:bg-transparent"
        >
          <X size={12} />
        </Button>
      )}
    </Tag>
  );
};

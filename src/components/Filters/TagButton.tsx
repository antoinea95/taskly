import { TaskTagType } from "@/utils/types/tasks.types";
import { Button } from "../ui/button";

export const TagButton = ({ tag, handleSelectedTags }: { tag: TaskTagType; handleSelectedTags: (tag: TaskTagType) => void }) => {
  return (
    <Button
      key={tag.title}
      style={{ background: tag.color }}
      className="rounded-full flex gap-2 shadow-none text-black text-xs px-2 py-1 h-fit cursor-pointer border-2 border-transparent hover:border-black dark:hover:border-white"
      onClick={() => handleSelectedTags(tag)}
    >
      {tag.title}
    </Button>
  );
};
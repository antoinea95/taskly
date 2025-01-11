import { TaskTagType } from "@/utils/types/tasks.types";
import { TagButton } from "./TagButton";



export const SelectLabel = ({
  uniqueTagsFromTasks,
  handleSelectedTags,
  selectedTags,
}: {
  uniqueTagsFromTasks: TaskTagType[];
  handleSelectedTags: (tag: TaskTagType) => void;
  selectedTags: TaskTagType[];
}) => {
  const isSelected = (tag: TaskTagType) => selectedTags.some((selectedTag) => selectedTag.title === tag.title);

  if(uniqueTagsFromTasks.length === 0) return null;

  return (
    <div className=" bg-gray-100 w-fit px-3 py-3 h-14 rounded-xl flex items-center">
      <div className="flex items-center gap-2">
        {uniqueTagsFromTasks
          .filter((tag) => !isSelected(tag)) // Filtrer les tags non sélectionnés
          .map((tag) => (
            <TagButton tag={tag} key={tag.title} handleSelectedTags={handleSelectedTags} />
          ))}
      </div>
    </div>
  );
};

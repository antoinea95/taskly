import { TaskTagType } from "@/utils/types/tasks.types";
import { TagButton } from "./TagButton";


/**
 * Display all tags label in the board and allow user to select some to filter task in the board
 * @param {TaskTagType[]} props.uniqueTagsFromTasks - all tags label in the board
 * @param {(tag: TaskTagType) => void} props.handleSelectedTag - Function wich handle the tag selection
 * @param {TaskTagType[]} props.selectedTags - Array of the selectedTag
 */
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
    <div className=" bg-gray-100 dark:bg-gray-600 w-fit px-3 py-3 min-h-14 rounded-xl flex items-center">
      <div className="flex items-center gap-2 flex-wrap">
        {uniqueTagsFromTasks
          .filter((tag) => !isSelected(tag))
          .map((tag) => (
            <TagButton tag={tag} key={tag.title} handleSelectedTags={handleSelectedTags} />
          ))}
      </div>
    </div>
  );
};

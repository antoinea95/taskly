import { TaskTagType, TaskType } from "@/utils/types/tasks.types";
import { useMemo, useState } from "react";
import { SearchBar } from "./SearchBar";
import { SelectLabel } from "./SelectLabels";
import { TagButton } from "./TagButton";

type TaskFilterProps = {
  tasks: TaskType[] | null;
  uniqueTagsFromTasks: TaskTagType[]
  children: (filteredTasks: TaskType[]) => JSX.Element;
};

/**
 * Render a search bar and a list of tag to filter task in the board
 * @param {TaskType[]} props.task - All the tasks in the board
 * @param {TaskTagType[]} props.uniqueTagsFromTasks - An array of all tags labels in the board
 * @param {(filteredTasks: TaskType[]) => JSX.Element} props.children - A function which pass the array of the filtered Tasks to the list card
 */
export const TaskFilter = ({tasks, uniqueTagsFromTasks, children }: TaskFilterProps) => {
  const [searchValue, setSearchValue] = useState("");
  const [selectedTags, setSelectedTags] = useState<TaskTagType[]>([]);

  const handleSelectedTags = (tag: TaskTagType) => {
    setSelectedTags((prevSelectedTags: TaskTagType[]) => {
      if (prevSelectedTags.some((selectedTag) => selectedTag.title === tag.title)) {
        return prevSelectedTags.filter((selectedTag) => selectedTag.title !== tag.title);
      } else {
        return [...prevSelectedTags, tag];
      }
    });
  };

  const filteredTasks = useMemo(() => {
    if (!tasks) return [];
    return tasks.filter((task) => {
      const matchesSearchValue = searchValue ? task.title.trim().toLowerCase().includes(searchValue.trim().toLowerCase()) : true;
      const matchSelectedLabels = selectedTags.length
        ? selectedTags.some((selectedTag) => task.labels?.some((tag) => tag.title === selectedTag.title))
        : true;

      return matchesSearchValue && matchSelectedLabels;
    });
  }, [searchValue, tasks, selectedTags]);

  return (
    <section>
      <div className=" w-full rounded-xl p-3 space-y-3">
        <div className="flex items-center gap-2 flex-wrap">
        <SearchBar handleFilteredTasks={(e) => setSearchValue(e.target.value)} />
        <SelectLabel uniqueTagsFromTasks={uniqueTagsFromTasks} handleSelectedTags={handleSelectedTags} selectedTags={selectedTags} />
        </div>
        <div className="flex items-center gap-2">
        {selectedTags.length > 0 && selectedTags.map((selectedTag) => <TagButton tag={selectedTag} handleSelectedTags={handleSelectedTags} />)}
        </div>
      </div>
      {children(filteredTasks)}
    </section>
  );
};

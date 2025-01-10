import { TaskTagType, TaskType } from "@/utils/types/tasks.types";
import { useMemo, useState } from "react";
import { SearchBar } from "./SearchBar";
import { SelectLabel } from "./SelectLabels";
import { TagButton } from "./TagButton";

type TaskFilterProps = {
  tasks: TaskType[];
  children: (filteredTasks: TaskType[]) => JSX.Element;
};

export const TaskFilter = ({ tasks, children }: TaskFilterProps) => {
  const [searchValue, setSearchValue] = useState("");
  const [selectedTags, setSelectedTags] = useState<TaskTagType[]>([]);

  const uniqueTagsFromTasks = useMemo(() => {
    if (!tasks) return [];

    const uniqueTags = tasks.reduce(
      (acc, task) => {
        task.labels?.forEach((label) => {
          if (!acc[label.title]) {
            acc[label.title] = label.color;
          }
        });
        return acc;
      },
      {} as Record<string, string>
    );

    return Object.keys(uniqueTags).map((label) => ({
      title: label,
      color: uniqueTags[label],
    }));
  }, [tasks]);

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
      const matchesSearchValue = searchValue ? task.title.toLowerCase().includes(searchValue.toLowerCase()) : true;
      const matchSelectedLabels = selectedTags.length
        ? selectedTags.every((selectedTag) => task.labels?.some((tag) => tag.title === selectedTag.title))
        : true;

      return matchesSearchValue && matchSelectedLabels;
    });
  }, [searchValue, tasks, selectedTags]);

  return (
    <section>
      <div className=" w-full rounded-xl p-3 space-y-3">
        <div className="flex items-center gap-2">
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

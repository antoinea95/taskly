import { TagButton } from "@/components/Filters/TagButton";
import { AddForm } from "@/components/Form/AddForm";
import { Select, SelectItem, SelectTrigger } from "@/components/ui/select";
import { BoardContext } from "@/utils/helpers/context/BoardContext";
import { MutationResultType } from "@/utils/types/form.types";
import { TaskTagType, TaskType } from "@/utils/types/tasks.types";
import { SelectContent, SelectValue } from "@radix-ui/react-select";
import { useContext, useEffect, useMemo, useState } from "react";

/**
 * Renders a component to add labels to a task, allowing the user to select a color for the label.
 *
 * @param {Object} props - Component props
 * @param {TaskTagType[]} [props.labels] - Existing labels associated with the task
 * @param {MutationResultType<string, Partial<TaskType>>} props.mutationQuery - Mutation function for updating the task's labels
 * @returns The AddLabel component
 */
export const AddLabel = ({ labels, mutationQuery }: { labels?: TaskTagType[]; mutationQuery: MutationResultType<string, Partial<TaskType>> }) => {
  const [isAddLabel, setIsAddLabel] = useState(false);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [labelAlreadyExist, setLabelAlreadyExist] = useState<string | null>(null);

  const boardContext = useContext(BoardContext);

  if (!boardContext) {
    throw new Error("Component AddLabel must be within a BoardContext Provider");
  }

  // Get uniqueTagsFromTasks
  const { uniqueTagsFromTasks } = boardContext;

  // Delete labels already in tasks;
  const filteredUniqueTagsFromTasks = useMemo(() => {
    return uniqueTagsFromTasks.filter((tag) => !labels?.some((label) => label.title === tag.title));
  }, [labels, uniqueTagsFromTasks]);

  // List of color options for labels
  const colorOptions = [
    { name: "Grey", color: "#e5e7eb" },
    { name: "Red", color: "#fca5a5" },
    { name: "Orange", color: "#fdba74" },
    { name: "Yellow", color: "#fde047" },
    { name: "Green", color: "#86efac" },
    { name: "Blue", color: "#93c5fd" },
    { name: "Violet", color: "#c084fc" },
  ];

  /** Reset error message */
  useEffect(() => {
    if (labelAlreadyExist) {
      const timeOut = setTimeout(() => setLabelAlreadyExist(null), 3000);
      return () => clearTimeout(timeOut);
    }
  }, [labelAlreadyExist]);

  /**
   * Handles color selection for the label.
   *
   * @param {string} color - The selected color in hexadecimal format
   */
  const handleChangeColor = (color: string) => {
    setSelectedColor(color);
  };

  /**
   * Handles the addition of a new label to the task.
   *
   * @param {Partial<TaskType>} data - The task data, including the title of the new label
   */
  const handleAddLabel = async (data: Partial<TaskType>) => {
    let newLabel = {
      title: data.title,
      color: selectedColor ? selectedColor : "#e5e7eb", // Default color if none is selected
    };

    // Check if the label already exists
    const labelExistsInTasks = labels?.some((label) => label.title === newLabel.title);
    const labelExistsInBoard = uniqueTagsFromTasks.some((tag) => tag.title.trim().toLowerCase() === newLabel.title?.trim().toLowerCase());

    if (labelExistsInTasks) {
      setLabelAlreadyExist("This label already exists on this task.");
      return;
    }

    if (labelExistsInBoard) {
      const actualLabel = uniqueTagsFromTasks.find((tag) => tag.title.trim().toLowerCase() === newLabel.title?.trim().toLowerCase());
      newLabel = actualLabel ? actualLabel : newLabel;
    }

    mutationQuery.mutate(
      {
        labels: labels ? [...labels, newLabel] : [newLabel],
      } as Partial<TaskType>,
      {
        onSuccess: () => {
          setSelectedColor(null); // Reset color after label is added
        },
      }
    );
  };

  return (
    <>
      {isAddLabel && filteredUniqueTagsFromTasks.length > 0 && (
        <div className="bg-gray-100 dark:bg-gray-700 rounded-xl p-3 space-y-3">
          <h4 className="text-sm">Select a label: </h4>
          <div className=" flex items-center gap-2 flex-wrap">
            {filteredUniqueTagsFromTasks.map((tag) => (
              <TagButton key={tag.title} tag={tag} handleSelectedTags={handleAddLabel} />
            ))}
          </div>
        </div>
      )}
      <div className="relative">
        <AddForm name="Label" mutationQuery={mutationQuery} onSubmit={handleAddLabel} isOpen={isAddLabel} setIsOpen={setIsAddLabel} />
        {labelAlreadyExist && <small className="text-red-500">{labelAlreadyExist}</small>}
        {isAddLabel && (
          <Select onValueChange={handleChangeColor} defaultValue="#e5e7eb">
            <SelectTrigger className="w-20 absolute right-0 top-0 dark:bg-gray-700">
              <SelectValue />
            </SelectTrigger>
            <SelectContent
              position="popper"
              className="w-fit px-6 py-2 bg-gray-100 dark:bg-gray-700 rounded-br-xl rounded-bl-xl -translate-y-2 flex flex-col items-center z-50"
            >
              {colorOptions.map((color) => (
                <SelectItem key={color.name} value={color.color}>
                  <div className="w-10 flex items-center justify-center">
                    <span
                      className="inline-flex w-5 h-5 rounded-full"
                      style={{
                        backgroundColor: color.color,
                      }}
                    />
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>
    </>
  );
};

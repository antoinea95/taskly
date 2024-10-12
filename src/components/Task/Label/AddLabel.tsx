import { AddForm } from "@/components/Form/AddForm";
import { MutationResultType } from "@/utils/types/form.types";
import { TaskTagType, TaskType } from "@/utils/types/tasks.types";
import { Check } from "lucide-react";
import { useState } from "react";

/**
 * Renders a component to add labels to a task, allowing the user to select a color for the label.
 *
 * @param {Object} props - Component props
 * @param {TaskTagType[]} [props.labels] - Existing labels associated with the task
 * @param {MutationResultType<string, Partial<TaskType>>} props.mutationQuery - Mutation function for updating the task's labels
 * @returns The AddLabel component
 */
export const AddLabel = ({
  labels,
  mutationQuery,
}: {
  labels?: TaskTagType[];
  mutationQuery: MutationResultType<string, Partial<TaskType>>;
}) => {
  const [isAddLabel, setIsAddLabel] = useState(false);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  // List of color options for labels
  const colorOptions = [
    { name: "Red", color: "#fca5a5" },
    { name: "Orange", color: "#fdba74" },
    { name: "Yellow", color: "#fde047" },
    { name: "Green", color: "#86efac" },
    { name: "Blue", color: "#93c5fd" },
  ];

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
    const newLabel = {
      title: data.title,
      color: selectedColor ? selectedColor : "#e5e7eb", // Default color if none is selected
    };

    mutationQuery.mutate(
      {
        labels: labels ? [...labels, newLabel] : [newLabel],
      } as Partial<TaskType>,
      {
        onSuccess: () => {
          setIsAddLabel(false);
          setSelectedColor(null); // Reset color after label is added
        },
      }
    );
  };

  return (
    <div className="bg-gray-50 rounded-xl">
      {isAddLabel && (
        <div className="p-3 space-y-2">
          <div className="flex items-center gap-2">
            <label htmlFor="color">Select tag color: </label>
            <span className="text-sm flex items-center justify-end bg-white w-fit px-3 py-1 rounded-xl">
              Default:
              <span className="inline-block w-4 h-4 rounded-full bg-gray-200 mx-1"></span>
            </span>
          </div>
          <div className="flex space-x-3">
            {colorOptions.map((color) => (
              <label key={color.name} htmlFor={color.name}>
                <input
                  type="radio"
                  id={color.name}
                  name="color"
                  value={color.color}
                  className="hidden"
                  onChange={() => handleChangeColor(color.color)}
                />
                <div
                  className={`shadow-none rounded-full w-8 h-8 border-2 flex items-center justify-center cursor-pointer border-gray-300`}
                  style={{
                    backgroundColor: color.color,
                  }}
                >
                  {selectedColor === color.color && <Check size={18} />}
                </div>
              </label>
            ))}
          </div>
        </div>
      )}
      <AddForm
        name="Label"
        mutationQuery={mutationQuery}
        onSubmit={handleAddLabel}
        isOpen={isAddLabel}
        setIsOpen={setIsAddLabel}
      />
    </div>
  );
};

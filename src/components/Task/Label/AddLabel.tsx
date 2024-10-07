import { AddItem } from "@/components/Form/AddItem";
import { TaskTagType, TaskType } from "@/utils/types";
import { UseMutationResult } from "@tanstack/react-query";
import { Check } from "lucide-react";
import { useState } from "react";

export const AddLabel = ({
  labels,
  query,
}: {
  labels?: TaskTagType[];
  query: UseMutationResult<any, unknown, Partial<TaskType>>;
}) => {
  const [isAddLabel, setIsAddLabel] = useState(false);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  // Dictionnaire de couleurs pour l'hexadécimal
  const colorOptions = [
    { name: "Red", color: "#fca5a5" },
    { name: "Orange", color: "#fdba74" },
    { name: "Yellow", color: "#fde047" },
    { name: "Green", color: "#86efac" },
    { name: "Blue", color: "#93c5fd" },
  ];

  const handleChange = (color: string) => {
    setSelectedColor(color);
  };

  const onSubmit = async (data: { title: string }) => {
    const newLabel = {
      title: data.title,
      color: selectedColor ? selectedColor : "#e5e7eb",
    };

    query.mutate({
      labels: labels ? [...labels, newLabel] : [newLabel],
    }, {
        onSuccess: () => {setIsAddLabel(false); setSelectedColor(null)}
    });
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
                  onChange={() => handleChange(color.color)}
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
      <AddItem
        type="Label"
        query={query}
        onSubmit={onSubmit}
        isOpen={isAddLabel}
        setIsOpen={setIsAddLabel}
      />
    </div>
  );
};

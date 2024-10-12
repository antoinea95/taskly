import { Button } from "../ui/button";
import { X } from "lucide-react";
import { ToggleButtonProps } from "../../utils/types/buttons.types";

/**
 * CloseButton component
 *
 * This component renders a button that, when clicked, closes a modal or toggles a state to false.
 *
 * @param {Object} props - The props for the component.
 * @param {Dispatch<SetStateAction<boolean>>} props.setIsOpen - A function that sets the state of whether the modal or component is open. Passing `false` will close it.
 *
 * @returns A button element that triggers the closing action when clicked.
 */
export const CloseButton = ({
  setIsOpen,
}: ToggleButtonProps) => {
  return (
    <Button
      type="button"
      className="w-full h-10 px-3 rounded-xl bg-gray-200 text-black flex gap-2 shadow-none border-none hover:bg-gray-300"
      onClick={() => setIsOpen(false)}
    >
      <X size={16} /> Cancel
    </Button>
  );
};

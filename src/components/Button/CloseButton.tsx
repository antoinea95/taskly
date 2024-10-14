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
      className="rounded-xl hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-600"
      variant="secondary"
      size="icon"
      aria-label="Cancel"
      onClick={() => setIsOpen(false)}
    >
      <X size={16} />
    </Button>
  );
};

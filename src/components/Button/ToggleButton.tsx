import { PropsWithChildren } from "react";
import { Button } from "../ui/button";
import { ToggleButtonProps } from "../../utils/types/buttons.types";

/**
 * ToggleButton component
 * 
 * A button that triggers an action when clicked to toggle the visibility or state of a modal, dropdown, etc.
 * It passes `true` to `setIsOpen` when clicked.
 * 
 * @param {PropsWithChildren<ToggleButtonProps>} props - The properties for the ToggleButton component.
 * @param {function} props.setIsOpen - A function to update the state that controls the visibility or state of the component being toggled.
 * @param {React.ReactNode} props.children - The content to be displayed inside the button.
 * 
 * @returns The rendered button component.
 */
export const ToggleButton = ({
  setIsOpen,
  children,
}: PropsWithChildren<ToggleButtonProps>) => {
  return (
    <Button
      onClick={() => setIsOpen(true)}
      className="rounded-xl flex gap-2 w-full shadow-none hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-600 animate-fade-in"
      variant="secondary"
    >
      {children}
    </Button>
  );
};

import { PropsWithChildren } from "react";
import { Button } from "../ui/button";
import { ToggleButtonProps } from "../types/buttons.types";

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
      className="w-full h-10 px-3 rounded-xl bg-gray-100 text-black flex gap-2 shadow-none border-none hover:bg-black hover:text-white animate-fade-in"
    >
      {children}
    </Button>
  );
};

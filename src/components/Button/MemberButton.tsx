import { Button } from "../ui/button";
import { UserPlus } from "lucide-react";
import { MemberButtonProps } from "../../utils/types/buttons.types";

/**
 * MemberButton component
 *
 * This component renders a button that allows the user to add or assign a member.
 * The button's appearance and behavior change based on the `type` prop.
 * - If `type === "tasks"`, the button will have a full-width style and will display "Assigned to".
 * - If `type === "boards"`, the button will display a smaller button with a different hover effect.
 *
 * @param {MemberButtonProps} props - The properties for the MemberButton component.
 * @param {Dispatch<SetStateAction<boolean>>} props.setIsOpen - Function to toggle the open state.
 * @param {string} props.type - The type of button, determining its appearance and behavior.
 *
 * @returns The rendered button component.
 */
export const MemberButton = ({ setIsOpen, type }: MemberButtonProps) => {
  // Determine the button's className based on the `type` prop
  const className =
    type === "tasks"
      ? "rounded-xl flex gap-2"
      : "flex md:items-center md:justify-start md:overflow-hidden rounded-xl gap-2 md:gap-0 md:w-12 md:p-0 md:hover:w-72 md:hover:justify-center transition-all duration-200";

  return (
    <Button
      onClick={() => setIsOpen(true)}
      className={`${className} animate-fade-in shadow-none hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-600`}
      variant="secondary"
    >
      {/* Render the UserPlus icon */}
      <UserPlus
        size={18}
        className={`shrink-0 ${type === "boards" ? "md:w-12" : ""}`}
      />
      {/* Conditionally render the button text based on the `type` prop */}
      {type === "tasks" ? "Assigned to" : "Add member"}
    </Button>
  );
};

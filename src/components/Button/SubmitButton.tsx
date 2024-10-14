import { PropsWithChildren } from "react";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/ui/loader";
import { SubmitButtonProps } from "../../utils/types/buttons.types";

/**
 * SubmitButton component
 * 
 * A button component used for form submissions that shows a loader when the request is pending.
 * - When `isPending` is true, a loading spinner (Loader) is displayed inside the button.
 * - When `isPending` is false, the button displays the provided children text or elements.
 * 
 * @param {PropsWithChildren<SubmitButtonProps>} props - The properties for the SubmitButton component.
 * @param {boolean} props.isPending - Determines if the button should show a loading spinner.
 * @param {React.ReactNode} props.children - The content to display inside the button when `isPending` is false.
 * @param {boolean} props.disabled - Disables the button when true, preventing interactions.
 * 
 * @returns The rendered button component.
 */
export const SubmitButton = ({
  isPending,
  children,
  disabled
}: PropsWithChildren<SubmitButtonProps>) => {
  return (
    <Button
      type="submit"
      disabled={disabled}
      className="rounded-xl flex-1 dark:text-gray-900 dark:bg-gray-300"
    >
      {/* If `isPending` is true, show the loader */}
      {isPending ? (
        <Loader data={{ color: "white", size: "1rem" }} />
      ) : (
        // Otherwise, display the children (button text or elements)
        <>{children}</>
      )}
    </Button>
  );
};

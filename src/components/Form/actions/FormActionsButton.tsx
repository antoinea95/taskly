import { CloseButton } from "../../Button/CloseButton";
import { SubmitButton } from "../../Button/SubmitButton";
import { FormActionsButtonProps } from "../../../utils/types/form.types";
import { PropsWithChildren } from "react";

/**
 * FormActionsButton component
 * 
 * A component that renders form action buttons. It includes a submit button and optionally a close button.
 * The submit button displays the action name and shows a pending state when the action is in progress.
 * The close button is displayed if a `setIsOpen` function is passed, allowing the user to close the form or modal.
 * 
 * @param {FormActionsButtonProps} props - The properties for the FormActionsButton component.
 * @param props.children - Content of submit button
 * @param {string} props.actionName - The name or label of the action (e.g., "Submit", "Save").
 * @param {boolean} props.isPending - A boolean indicating whether the submit action is pending.
 * @param {boolean} props.disabled - A boolean indicating whether the submit button should be disabled.
 * @param {function} [props.setIsOpen] - An optional function to close the form or modal, displayed as a close button.
 * 
 * @returns The rendered action buttons.
 */
export const FormActionsButton = ({
  isPending,
  disabled,
  children,
  setIsOpen,
}:  PropsWithChildren<FormActionsButtonProps>) => {
  return (
    <div className="flex items-center space-x-3">
      {/* Submit button */}
      <SubmitButton isPending={isPending} disabled={disabled}>
        {children}
      </SubmitButton>
      {/* Close button (optional) */}
      {setIsOpen && <CloseButton setIsOpen={setIsOpen} />}
    </div>
  );
};

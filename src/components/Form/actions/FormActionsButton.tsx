import { CloseButton } from "../../Button/CloseButton";
import { SubmitButton } from "../../Button/SubmitButton";
import { FormActionsButtonProps } from "../../types/form.types";

/**
 * FormActionsButton component
 * 
 * A component that renders form action buttons. It includes a submit button and optionally a close button.
 * The submit button displays the action name and shows a pending state when the action is in progress.
 * The close button is displayed if a `setIsOpen` function is passed, allowing the user to close the form or modal.
 * 
 * @param {FormActionsButtonProps} props - The properties for the FormActionsButton component.
 * @param {string} props.actionName - The name or label of the action (e.g., "Submit", "Save").
 * @param {boolean} props.isPending - A boolean indicating whether the submit action is pending.
 * @param {boolean} props.disabled - A boolean indicating whether the submit button should be disabled.
 * @param {function} [props.setIsOpen] - An optional function to close the form or modal, displayed as a close button.
 * 
 * @returns {JSX.Element} The rendered action buttons.
 */
export const FormActionsButton = ({
  actionName,
  isPending,
  disabled,
  setIsOpen,
}: FormActionsButtonProps) => {
  return (
    <div className="flex items-center gap-2">
      {/* Submit button */}
      <SubmitButton isPending={isPending} disabled={disabled}>
        {actionName}
      </SubmitButton>
      {/* Close button (optional) */}
      {setIsOpen && <CloseButton setIsOpen={setIsOpen} />}
    </div>
  );
};

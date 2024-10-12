import { FieldValues } from "react-hook-form";
import { z } from "zod";
import { Plus, Tag } from "lucide-react";
import { ToggleButton } from "../Button/ToggleButton";
import { AddFormProps } from "../../utils/types/form.types";
import { FormContainer } from "./containers/FormContainer";
import { FormFieldInputItem } from "./fields/FormFieldInputItem";
import { FormActionsButton } from "./actions/FormActionsButton";

/**
 * AddForm Component
 *
 * This component is used to render a form for adding or updating an item (like a board, label, etc.).
 * It handles form submission, field validation, and conditionally renders a toggle button or form based on `isOpen`.
 *
 * @template T - The type for field values extending `FieldValues`.
 *
 * @param {Object} props - The props required for rendering the component.
 * @param {string} props.name - The name of the item to be added (e.g., 'Board', 'Label').
 * @param {Function} props.onSubmit - Function to handle form submission.
 * @param {MutationResult<string, T>} props.mutationQuery - The query mutation result from react-query for handling success, error, and pending states.
 * @param {boolean} props.isOpen - Controls whether the form is visible.
 * @param {Function} props.setIsOpen - Function to toggle form visibility.
 *
 * @returns The rendered form or toggle button depending on the `isOpen` state.
 */
export const AddForm = <T extends FieldValues>({
  name,
  onSubmit,
  mutationQuery,
  isOpen,
  setIsOpen,
}: AddFormProps<T>) => {
  // Zod schema for validating form input
  const ItemSchema = z.object({
    title: z.string().min(2, "Title must be at least 2 characters long"),
  });

  /**
   * Renders the form layout.
   *
   * This function renders the entire form, including input fields, buttons, and error messages.
   *
   * @returns {JSX.Element} The form element including input fields, buttons, and error messages.
   */
  const renderForm = (): JSX.Element => (
    <FormContainer
      schema={ItemSchema}
      onSubmit={onSubmit}
      mutationQuery={mutationQuery}
    >
      {({ form }) => (
        <div className={`${name === "comment" ? "flex items-center gap-2 w-full" : "space-y-3"}`}>
          <FormFieldInputItem
            form={form}
            item={{ name: "title", type: "text", placeholder: `Add your ${name}` }}
          />
          <FormActionsButton
            isPending={mutationQuery.isPending}
            setIsOpen={setIsOpen}
            disabled={
              name === "comment"
                ? false
                : mutationQuery.isPending ||
                  Object.keys(form.getValues()).length === 0
            }
          >
            <span className="flex items-center gap-2">
              <Plus size={16} />
              Add {name}
            </span>
          </FormActionsButton>
        </div>
      )}
    </FormContainer>
  );

  /**
   * Conditionally renders the toggle button or the form based on `isOpen`.
   *
   * If the form is open, the form is rendered; otherwise, a toggle button is shown.
   *
   * @returns {JSX.Element} The toggle button or the form depending on the `isOpen` state.
   */
  return setIsOpen ? (
    isOpen ? (
      renderForm()
    ) : (
      <ToggleButton setIsOpen={setIsOpen}>
        {name === "Label" ? <Tag size={16} /> : <Plus size={16} />}
        Add a {name.toLowerCase()}
      </ToggleButton>
    )
  ) : (
    renderForm()
  );
};

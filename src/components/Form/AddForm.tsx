import { FieldValues } from "react-hook-form";
import { z } from "zod";
import { Plus, Tag } from "lucide-react";
import { ToggleButton } from "../Button/ToggleButton";
import { AddFormProps, FormFieldItemType } from "./form.types";
import { FormContainer } from "./FormContainer";
import { FormFieldItem } from "./FormFieldItem";

/**
 * AddItem Component
 * 
 * This component is used to render a form for adding or updating an item (like a board, label, etc.).
 * It handles form submission, field validation, and conditionally renders a toggle button or form based on `isOpen`.
 *
 * @template T - The type for field values extending `FieldValues`.
 * 
 * @param props - The props required for rendering the component.
 * @param props.name - The name of the item to be added (e.g., 'Board', 'Label').
 * @param props.onSubmit - Function to handle form submission.
 * @param props.mutationQuery - The query mutation result from react-query for handling success, error, and pending states.
 * @param props.isOpen - Controls whether the form is visible.
 * @param props.setIsOpen - Function to toggle form visibility.
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

  const itemField: FormFieldItemType = {
    name: "title",
    type: "text",
    placeholder: name
  }

  /**
   * Renders the form layout.
   * 
   * @returns The form element including input fields, buttons, and error messages.
   */
  const renderForm = (): JSX.Element => (
    <FormContainer schema={ItemSchema} onSubmit={onSubmit} mutationQuery={mutationQuery} submitButtonName={`New ${name}`}>
      {({form}) => (
        <FormFieldItem  form={form} item={itemField}/>
      )}
    </FormContainer>
  );

  /**
   * Conditionally renders the toggle button or the form based on `isOpen`.
   * 
   * @returns The toggle button or the form depending on the state.
   */
  return setIsOpen ? (
    isOpen ? (
      renderForm()
    ) : (
      <ToggleButton setIsOpen={setIsOpen}>
        {name === "Label" ? <Tag size={16}/> : <Plus size={16} />}
        Add a {name.toLowerCase()}
      </ToggleButton>
    )
  ) : (
    renderForm()
  );
};

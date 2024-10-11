import { useState, useRef, useEffect } from "react";
import { DefaultValues, FieldValues } from "react-hook-form";
import { z } from "zod";
import { FormFieldItemType, UpdateTitleProps } from "../types/form.types";
import { FormContainer } from "./containers/FormContainer";
import { FormFieldInputItem } from "./fields/FormFieldInputItem";

/**
 * UpdateTitleForm Component
 *
 * This component is used to render a title that can be updated by clicking on it.
 * When clicked, it switches to an input field to allow the user to update the title.
 * The component handles form submission, field validation, and rendering of the title or the input.
 *
 * @template T - The type for field values extending `FieldValues`.
 *
 * @param {Object} props - The props required for rendering the component.
 * @param {string} props.name - The name of the title to be updated (e.g., 'Board', 'Label').
 * @param {string} props.title - The current title that will be displayed and can be updated.
 * @param {MutationResult<void, T>} props.mutationQuery - The query mutation result from react-query for handling success, error, and pending states.
 * @param {string} [props.headingLevel="h1"] - The heading level (e.g., "h1", "h2") to be used for the title display.
 *
 * @returns The rendered component, either the title or the input field for updating the title.
 */
export const UpdateTitleForm = <T extends FieldValues>({
  name,
  title,
  mutationQuery,
  headingLevel: Heading = "h1",
}: UpdateTitleProps<T>) => {
  const [isUpdate, setIsUpdate] = useState(false);
  const divRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  /**
   * Handles the click outside of the div to close the update input.
   *
   * @param {MouseEvent} event - The mouse event that triggered the outside click.
   */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (divRef.current && !divRef.current.contains(event.target as Node)) {
        setIsUpdate(false);
      }
    };

    if (isUpdate) {
      if (inputRef.current) {
        inputRef.current.focus();
      }
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isUpdate]);

  // Zod schema for validating the title input.
  const titleSchema = z.object({
    title: z.string().min(2, "Title must be at least 2 characters long"),
  });

  /**
   * Handles form submission for updating the title.
   *
   * @param {T} data - The form data to be submitted.
   */
  const onSubmit = async (data: T) => {
    mutationQuery.mutate(data, {
      onSuccess: () => setIsUpdate(false),
    });
  };

  const itemField: FormFieldItemType = {
    name: "title",
    type: "text",
    placeholder: name,
  };

  return (
    <div onClick={() => setIsUpdate(true)} ref={divRef}>
      {!isUpdate ? (
        <Heading
          className={`px-3 py-2 cursor-text rounded-xl hover:bg-gray-200 animate-fade-in`}
        >
          {title}
        </Heading>
      ) : (
        <FormContainer
          schema={titleSchema}
          mutationQuery={mutationQuery}
          onSubmit={onSubmit}
          defaultValues={{ title: title } as unknown as DefaultValues<T>}
        >
          {({ form }) => (
            <>
              <FormFieldInputItem form={form} item={itemField} />
            </>
          )}
        </FormContainer>
      )}
    </div>
  );
};

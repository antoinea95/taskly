import { useState, useRef, useEffect } from "react";
import { FieldValues } from "react-hook-form";
import { z } from "zod";
import { UpdateTitleProps } from "../../utils/types/form.types";
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
  isDone,
}: UpdateTitleProps<T>) => {
  const [isUpdate, setIsUpdate] = useState(false);
  const [defineInputSize, setDefineInputSize] = useState<{
    height: number;
    width: number;
  } | null>(null);
  const divRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const headingSizeClass =
    Heading === "h1"
      ? "text-xl md:text-4xl"
      : Heading === "h2"
        ? "text-xl md:text-4xl"
        : Heading === "h3"
          ? "text-base"
          : "text-sm";

  /**
   * Handles the click outside of the div to close the update input.
   *
   * @param {MouseEvent} event - The mouse event that triggered the outside click.
   */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (divRef.current && !divRef.current.contains(event.target as Node)) {
        setIsUpdate(false);
        setDefineInputSize(null)
      }
    };

    if (divRef.current && !isUpdate) {
      setDefineInputSize({
        height: divRef.current.offsetHeight,
        width: divRef.current.offsetWidth,
      });
    }

    if (isUpdate) {
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
   * Effect that updates the input's style based on the heading and text.
   *
   * This effect runs whenever the values of `Heading`, `title`, or `isUpdate` change.
   * It adjusts the input's width based on the length of the text and applies a style
   * corresponding to the given heading. If the heading is unrecognized, a default style is applied.
   */

  useEffect(() => {
    if (inputRef.current && defineInputSize && isUpdate) {
      inputRef.current.focus();
      inputRef.current.style.width = `${defineInputSize.width}px`;
      inputRef.current.style.height = `${defineInputSize.height}px`;
;
    }
  }, [Heading, title, isUpdate, defineInputSize]);

  /**
   * Handles form submission for updating the title.
   *
   * @param {T} data - The form data to be submitted.
   */
  const handleUpdateTitle = async (data: T) => {
    mutationQuery.mutate(data, {
      onSuccess: () => setIsUpdate(false),
    });
  };

  return (
    <div onClick={() => setIsUpdate(true)} ref={divRef} className="hover:bg-gray-50 w-fit rounded-xl dark:hover:bg-gray-700 animate-fade-in py-2">
      {!isUpdate ? (
        <Heading
          className={`md:px-3 cursor-text rounded-xl animate-fade-in ${headingSizeClass} ${isDone ? "line-through" : ""} dark:text-gray-300`}
        >
          {title}
        </Heading>
      ) : (
        <FormContainer
          schema={titleSchema}
          mutationQuery={mutationQuery}
          onSubmit={handleUpdateTitle}
          defaultValues={{ title: title }}
        >
          {({ form }) => (
            <>
              <FormFieldInputItem
                form={form}
                item={{ name: "title", type: "text", placeholder: name }}
                ref={inputRef}
              />
            </>
          )}
        </FormContainer>
      )}
    </div>
  );
};

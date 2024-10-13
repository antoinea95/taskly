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
  isDone
}: UpdateTitleProps<T>) => {
  const [isUpdate, setIsUpdate] = useState(false);
  const [defineInputWidth, setDefineInputWidth] = useState<number | null>(null)
  const divRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const headingSizeClass =
    Heading === "h1"
      ? "text-4xl uppercase"
      : Heading === "h2"
        ? "text-4xl w-fit"
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
      }
    };

    if(divRef.current && !isUpdate) {
      setDefineInputWidth(divRef.current.offsetWidth);
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
    const inputStyle = {
      h1: { height: "56px", fontSize: "36px" },
      h2: { height: "56px", fontSize: "36px" },
      h3: { height: "40px", fontSize: "16px" },
      default: { height: "40px", fontSize: "14px" },
    } as const;



    if (inputRef.current && isUpdate) {
      const heading = Heading.toString() as keyof typeof inputStyle;

      inputRef.current.focus();
      inputRef.current.style.width = `${defineInputWidth}px`;

      // Use a ternary expression to define the style
      const style = inputStyle[heading]
        ? inputStyle[heading]
        : inputStyle.default;

      inputRef.current.style.height = style.height;
      inputRef.current.style.fontSize = style.fontSize;
    }
  }, [Heading, title, isUpdate, defineInputWidth]);

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
    <div onClick={() => setIsUpdate(true)} ref={divRef}>
      {!isUpdate ? (
        <Heading
          className={`px-3 py-2 cursor-text rounded-xl hover:bg-gray-100 animate-fade-in ${headingSizeClass} ${isDone ? "line-through" : ""}`}
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

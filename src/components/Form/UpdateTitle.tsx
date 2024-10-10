import { useState, useRef, useEffect } from "react";
import { FieldValues } from "react-hook-form";
import { z } from "zod";
import { FormFieldItemType, UpdateTitleProps } from "./form.types";
import { FormContainer } from "./FormContainer";
import { FormFieldItem } from "./FormFieldItem";

export const UpdateTitleForm = <T extends FieldValues>({
  name,
  title,
  mutationQuery,
  headingLevel: Heading = "h1",
}: UpdateTitleProps<T>) => {
  const [isUpdate, setIsUpdate] = useState(false);
  const divRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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

  const titleSchema = z.object({
    title: z.string().min(2),
  });

  const onSubmit = async (data: FieldValues) => {
    mutationQuery.mutate(data as T,
      {
        onSuccess: () => setIsUpdate(false),
      }
    );
  };

  const itemField: FormFieldItemType = {
    name: "title",
    type: "text",
    placeholder: name
  }

  return (
    <div onClick={() => setIsUpdate(true)} ref={divRef}>
      {!isUpdate ? (
        <Heading
          className={`px-3 py-2 cursor-text rounded-xl hover:bg-gray-200 animate-fade-in`}
        >
          {title}
        </Heading>
      ) : (
        <FormContainer schema={titleSchema} mutationQuery={mutationQuery} onSubmit={onSubmit} submitButtonName="">
          {({form}) => (
            <FormFieldItem form={form} item={itemField} />
          )}
        </FormContainer>
      )}
    </div>
  );
};

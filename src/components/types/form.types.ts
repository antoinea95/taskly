import { CheckedState } from "@radix-ui/react-checkbox";
import { UseMutationResult } from "@tanstack/react-query";
import { Dispatch, ElementType, ReactNode, SetStateAction } from "react";
import {
  DefaultValues,
  FieldValues,
  SubmitHandler,
  UseFormReturn,
} from "react-hook-form";
import { ZodType } from "zod";

// Generic mutation type for reusability
export type MutationResultType<
  TData,
  TVariables,
> = UseMutationResult<TData, Error, TVariables, unknown>;

// Input types for form fields
export type InputType = "text" | "email" | "password" | "number" | "textarea";

// Shared form props for reusable forms
export type FormProps<T extends FieldValues> = {
  form: UseFormReturn<T>;
};


// Reusable form field item type
export type FormFieldItemType = {
  name: string;
  type: InputType;
  placeholder: string;
  label?: string;
  hidden?: boolean;
  value?: string;
};

// Form container props optimized with extracted mutation and form types
export type FormContainerProps<T extends FieldValues> = {
  schema: ZodType<FieldValues>;
  onSubmit: SubmitHandler<T>;
  mutationQuery: MutationResultType<any, T>;
  children: (props: { form: UseFormReturn<T> }) => ReactNode;
  actionName?: string;
  defaultValues?: DefaultValues<T>;
};

// Input field props using the shared form props type
export type FormFieldInputItemProps<T extends FieldValues> = FormProps<T> & {
  item: FormFieldItemType;
};

// Date field props with shared form props
export type FormFieldDateItemProps<T extends FieldValues> = FormProps<T> & {
  key: "to" | "from";
};

// Checkbox field props
export type FormCheckBoxItemProps = {
  id: string;
  defaultChecked: boolean;
  onCheckedChange: (checked: CheckedState) => void;
  content: string;
  isDone?: boolean
};

// Actions button props
export type FormActionsButtonProps = {
  actionName: string;
  isPending: boolean;
  disabled?: boolean;
  setIsOpen?: Dispatch<SetStateAction<boolean>>;
};

// Add form props using reusable form and mutation query types
export type AddFormProps<T extends FieldValues> = {
  name: string;
  mutationQuery: MutationResultType<string, T>
  value?: string;
  onSubmit: SubmitHandler<T>;
  isOpen?: boolean;
  setIsOpen?: Dispatch<SetStateAction<boolean>>;
}
// Update title props with shared mutation query prop
export type UpdateTitleProps<T extends FieldValues> = {
  name: string;
  title: string;
  mutationQuery: MutationResultType<string, T>
  headingLevel?: ElementType;
};

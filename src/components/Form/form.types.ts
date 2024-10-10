import { UseMutationResult } from "@tanstack/react-query";
import { Dispatch, ElementType, ReactNode, SetStateAction } from "react";
import { FieldValues, SubmitHandler, UseFormReturn } from "react-hook-form";
import { ZodType } from "zod";

export type MutationResultType<
  TData,
  TError = Error,
  TVariables = TData | undefined,
  TContext = unknown,
> = UseMutationResult<TData, TError, TVariables, TContext>;

export type InputType = 'text' | 'email' | 'password' | 'number' | 'textarea';

export type FormFieldItemType = {
    name: string, 
    type: InputType,
    placeholder: string, 
    label?: string;
    hidden?: boolean;
    value?: string
}

export type FormContainerProps<T extends FieldValues> = {
    schema: ZodType<Partial<T>>;
    onSubmit: SubmitHandler<FieldValues>;
    mutationQuery: UseMutationResult<any, Error | unknown, any>;
    submitButtonName: string;
    children: (props: { form: UseFormReturn<T> }) => ReactNode
};

export type FormItemProps = {
    form: UseFormReturn<FieldValues, any, undefined>
    item: FormFieldItemType
}


export type AddFormProps<T extends FieldValues> = {
    name: string;
    value?: string;
    onSubmit: SubmitHandler<FieldValues>;
    mutationQuery: MutationResultType<string, Error, T, unknown>;
    isOpen?: boolean;
    setIsOpen?: Dispatch<SetStateAction<boolean>>;
};

export type  UpdateTitleProps<T extends FieldValues> = {
  name: string;
  title: string;
  mutationQuery: MutationResultType<string, Error, T, unknown>;
  headingLevel?: ElementType;
}

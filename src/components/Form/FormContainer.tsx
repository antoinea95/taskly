import { zodResolver } from "@hookform/resolvers/zod";
import { FieldValues, useForm } from "react-hook-form";
import {
  useEffect,
} from "react";
import { Form } from "../ui/form";
import { FormContainerProps } from "./form.types";
import { SubmitButton } from "../Button/SubmitButton";
import { StatusMessage } from "../Message/StatusMessage";

export const FormContainer = <T extends FieldValues>({
  schema,
  onSubmit,
  mutationQuery,
  submitButtonName,
  children
}: FormContainerProps<T>) => {
  // Utilisation dans `useForm`

  const form = useForm<T>({
    mode: "onSubmit",
    resolver: zodResolver(schema),
  });

  const { isError, error, isPending, isSuccess } = mutationQuery;

  useEffect(() => {
    if (isSuccess) {
      form.reset();
    }
  }, [isSuccess, form]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col w-full gap-4 h-fit"
      >
        {children && typeof children === "function" ? children({form: form}) : children}
        <SubmitButton
          isLoading={isPending}
          disabled={isPending || Object.keys(form.getValues()).length === 0}
        >
          {submitButtonName}
        </SubmitButton>
        {isError && (
          <StatusMessage
            isError={isError}
            isSucess={false}
            content={error && error instanceof Error ? error?.message : ""}
          />
        )}
      </form>
    </Form>
  );
};

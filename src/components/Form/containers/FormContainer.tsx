import { zodResolver } from "@hookform/resolvers/zod";
import { FieldValues, useForm} from "react-hook-form";
import { useEffect } from "react";
import { Form } from "../../ui/form";
import { FormContainerProps } from "../../types/form.types";
import { NotificationBanner } from "../../Notification/NotificationBanner";

/**
 * FormContainer is a reusable form component that handles form submission, 
 * validation using Zod, and optional default form values. It also integrates with 
 * a mutation query to manage form state during submission.
 *
 * @template T - The type of the form field values.
 *
 * @param {Object} props - The properties to configure the form.
 * @param {z.ZodSchema<T>} props.schema - Zod schema for form validation.
 * @param {(data: T) => void} props.onSubmit - The callback function executed when the form is submitted.
 * @param {MutationResultType<any, T>} props.mutationQuery - The mutation query object to manage form states like pending, success, or error.
 * @param {React.ReactNode | ((form: UseFormReturn<T>) => React.ReactNode)} props.children - Child elements or a function to render form elements.
 * @param {T} [props.defaultValues] - Optional default values for the form fields.
 *
 * @returns The form container component.
 */
export const FormContainer = <T extends FieldValues>({
  schema,
  onSubmit,
  mutationQuery,
  children,
  defaultValues,
}: FormContainerProps<T>) => {
  // Initialize the form with react-hook-form, setting the validation schema and default values (if provided).
  const form = useForm<T>({
    mode: "onSubmit",
    resolver: zodResolver(schema),
    defaultValues: defaultValues ? defaultValues : undefined
  });

  const { isError, error, isSuccess } = mutationQuery;

  // Reset the form fields when the mutation query indicates success.
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
        {/* If children is a function, pass the form instance to it; otherwise, render it directly */}
        {children && typeof children === "function" ? children({ form }) : children}

        {/* If there's an error in mutation query, show the error message */}
        {isError && (
          <NotificationBanner
            isError={isError}
            content={error && error instanceof Error ? error?.message : ""}
          />
        )}
      </form>
    </Form>
  );
};

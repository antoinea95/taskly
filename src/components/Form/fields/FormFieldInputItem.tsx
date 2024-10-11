import { FieldValues, Path } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "../../ui/form";
import { FormFieldInputItemProps } from "../../types/form.types";
import { Input } from "../../ui/input";

/**
 * FormFieldInputItem component used to display a text input field within a form.
 *
 * @template T - The type of field values used in the form.
 *
 * @param {Object} props - The props for the form field input item.
 * @param {UseFormReturn<T>} props.form - The form control object provided by `react-hook-form`.
 * @param {FormFieldInputItemProps<T>} props.item - The field configuration including the label, placeholder, type, and default value.
 *
 * @returns The rendered form field with an input item.
 */
export const FormFieldInputItem = <T extends FieldValues>({
  form,
  item,
}: FormFieldInputItemProps<T>) => {
  return (
    <FormField
      control={form.control}
      name={item.name as Path<T>}
      render={({ field }) => {
        return (
          <FormItem>
            <FormLabel>{item.label}</FormLabel>
            <FormControl>
              <Input
                placeholder={item.placeholder}
                onChange={field.onChange}
                defaultValue={item.value}
                type={item.type}
                className="h-10 rounded-xl bg-gray-200 border-none shadow-none"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};

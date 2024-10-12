import { FieldValues, Path } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../ui/form";
import { FormFieldInputItemProps } from "../../../utils/types/form.types";
import { Input } from "../../ui/input";
import React, { ForwardedRef } from "react";
import { Textarea } from "@/components/ui/textarea";

/**
 * A utility function that fixes the forward ref type for a given render function.
 *
 * @template T - The type of the ref.
 * @template P - The props type passed to the render function.
 * @param {(props: P, ref: React.Ref<T>) => React.ReactNode} render - The render function to be wrapped.
 * @returns - A component with a forwarded ref.
 */
function fixedForwardRef<T, P>(
  render: (props: P, ref: React.Ref<T>) => React.ReactNode
): (props: P & React.RefAttributes<T>) => React.ReactNode {
  return React.forwardRef(render) as any;
}

/**
 * FormFieldInputItem component used to display a text input field within a form.
 *
 * @template T - The type of field values used in the form.
 *
 * @param {Object} props - The props for the form field input item.
 * @param {UseFormReturn<T>} props.form - The form control object provided by `react-hook-form`.
 * @param {FormFieldInputItemProps<T>} props.item - The field configuration including the label, placeholder, type, and default value.
 * @param {ForwardedRef<HTMLInputElement>} ref - The forwarded ref for the input element.
 *
 * @returns The rendered form field with an input item.
 */
const InputItem = <T extends FieldValues>(
  props: FormFieldInputItemProps<T>,
  ref: ForwardedRef<HTMLInputElement>
) => {
  return (
    <FormField
      control={props.form.control}
      name={props.item.name as Path<T>}
      render={({ field }) => {
        return (
          <FormItem className="space-y-0 flex-1">
            <FormLabel>{props.item.label}</FormLabel>
            <FormControl>
              {props.item.name === "description" ? (
                <Textarea
                  placeholder={props.item.placeholder}
                  onChange={field.onChange}
                  defaultValue={field.value}
                  className="h-28 rounded-xl bg-gray-200 border-none shadow-none resize-none"
                />
              ) : (
                <Input
                  placeholder={props.item.placeholder}
                  onChange={field.onChange}
                  defaultValue={field.value}
                  type={props.item.type}
                  className="h-10 rounded-xl bg-gray-200 border-none shadow-none"
                  ref={ref}
                />
              )}
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};

/**
 * Higher-order component that wraps the InputItem with a forwarded ref.
 *
 */
export const FormFieldInputItem = fixedForwardRef(InputItem);

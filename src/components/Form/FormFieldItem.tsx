import { FieldValues, Path } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { FormItemProps } from "./form.types";
import { Input } from "../ui/input";

export const FormFieldItem = <T extends FieldValues>({form, item}: FormItemProps<T>) => {
  

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
    )
}
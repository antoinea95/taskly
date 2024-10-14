import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { FieldValues, Path, PathValue } from "react-hook-form";
import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";
import { FormFieldDateItemProps } from "../../../utils/types/form.types";

/**
 * FormFieldDateItem component used to display a date picker within a form.
 *
 * @template T - The type of field values used in the form.
 *
 * @param {Object} props - The props for the form field date item.
 * @param {UseFormReturn<T>} props.form - The form control object provided by `react-hook-form`.
 * @param {string} props.key - The key representing the field name in the form (either "from" or "to").
 *
 * @returns The rendered form field with a date picker.
 */
export const FormFieldDateItem = <T extends FieldValues>({
  form,
  id,
}: FormFieldDateItemProps<T>) => {
  // State to control popover open/close state
  const [isOpen, setIsOpen] = useState(false);

  /**
   * Handles disabling dates in the date picker.
   * Disables past dates and ensures the "from" date is earlier than the "to" date.
   *
   * @param {Date} date - The date to check.
   * @returns {boolean} True if the date should be disabled, false otherwise.
   */
  const handleDisabledDate = (date: Date) => {
    const today = new Date();
    const to = form.getValues().to?.getTime();

    today.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);

    if (id === "from" && to && date.getTime() >= to) {
      return true;
    }

    if (date.getTime() < today.getTime()) {
      return true;
    }
    return false;
  };

  /**
   * Handles selecting a date from the date picker.
   * Sets the selected date in the form field and closes the popover.
   *
   * @param {Date | undefined} date - The selected date.
   */
  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      // Set the selected date in the form field
      form.setValue(id as Path<T>, date as PathValue<T, Path<T>>);
    }
  };

  return (
    <FormField
      control={form.control}
      name={id as Path<T>}
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel htmlFor={id}>
            {id === "to" ? "Deadline" : "Start date"}
          </FormLabel>
          <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="secondary"
                  onClick={() => setIsOpen(true)}
                  className="rounded-xl hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-600"
                >
                  <span>
                    {field.value ? field.value.toDateString() : "Select a date"}
                  </span>
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-auto" align="start">
              <Calendar
                mode="single"
                onSelect={handleDateSelect}
                selected={field.value ? field.value : undefined}
                disabled={handleDisabledDate}
                className="w-full h-full dark:text-gray-300"
              />
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

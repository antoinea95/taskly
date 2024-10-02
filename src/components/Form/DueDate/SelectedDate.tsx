import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { UseFormReturn } from "react-hook-form";
import { Calendar } from "@/components/ui/calendar";

export const SelectedDate = ({
  form,
  name,
}: {
  form: UseFormReturn<{ to: Date; from: Date | null }, any, undefined>;
  name: "to" | "from";
}) => {
    
  const handleDisabledDate = (date: Date) => {
    const today = new Date();
    const to = form.getValues().to?.getTime();

    today.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);

    if (name === "from" && to && date.getTime() >= to) {
      return true;
    }

    if (date.getTime() < today.getTime()) {
      return true;
    }
    return false;
  };

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>{name === "to" ? "Due date" : "Begin Date"}</FormLabel>
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button variant={"outline"}>
                  <span>
                    {field.value ? field.value.toDateString() : "Select a date"}
                  </span>
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                onSelect={field.onChange}
                selected={field.value ? field.value : undefined}
                disabled={handleDisabledDate}
              />
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

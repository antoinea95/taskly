import { zodResolver } from "@hookform/resolvers/zod";
import { FieldValues, Path, useForm } from "react-hook-form";
import { Input } from "../ui/input";
import { Dispatch, SetStateAction, useEffect } from "react";
import { z } from "zod";
import { UseMutationResult } from "@tanstack/react-query";
import { Plus, X } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import { SubmitButton } from "../Button/SubmitButton";
import { CloseButton } from "../Button/CloseButton";
import { ToggleButton } from "../Button/ToggleButton";

type AddItemProps<T extends FieldValues> = {
  type: "Board"| "Task" | "List" | "Checklist" | "Item";
  onSubmit: (data: T) => Promise<void>;
  query: UseMutationResult<any, Error | unknown, T>;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
};

export const AddItem = <T extends FieldValues>({
  type,
  onSubmit,
  query,
  isOpen,
  setIsOpen,
}: AddItemProps<T>) => {
  const formSchema = z.object({
    title: z.string().min(2),
  });

  const form = useForm<T>({
    mode: "onSubmit",
    resolver: zodResolver(formSchema),
  });
  const { isSuccess, isPending, isError, error } = query;

  useEffect(() => {
    if (isSuccess) {
      form.reset();
    }
  }, [isSuccess, form]);

  return (
    <>
      {isOpen ? (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className={` flex flex-col gap-2 w-full p-3 rounded-xl ${type === "Checklist" ? "bg-gray-50" : "bg-white"}`}
          >
            <FormField
              control={form.control}
              name={"title" as Path<T>}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder={`${type} title`}
                      {...field}
                      type={"text"}
                      className="h-10 rounded-xl border-none shadow-none bg-gray-200"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center justify-between w-full gap-2">
              <SubmitButton isLoading={isPending}>
                <span className="flex items-center gap-2 text-xs">
                  <Plus size={16} />
                  Add {type.toLowerCase()}
                </span>
              </SubmitButton>
              <CloseButton setIsOpen={setIsOpen}>
                <X size={16} />
              </CloseButton>
            </div>
            {isError && (
              <p className="text-xs font-bold  border w-fit rounded bg-red-500 text-white py-2 px-3 uppercase self-center text-center">
                {error instanceof Error && error?.message}
              </p>
            )}
          </form>
        </Form>
      ) : (
        <ToggleButton setIsOpen={setIsOpen}>
          <Plus size={16} />
          Add a {type.toLowerCase()}
        </ToggleButton>
      )}
    </>
  );
};

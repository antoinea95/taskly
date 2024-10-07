import { zodResolver } from "@hookform/resolvers/zod";
import { FieldValues, useForm } from "react-hook-form";
import { Input } from "../ui/input";
import { Dispatch, SetStateAction, useEffect } from "react";
import { z } from "zod";
import { UseMutationResult } from "@tanstack/react-query";
import { Pen, Plus } from "lucide-react";
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
  type: string;
  value?: string;
  onSubmit: (data: { title: string }) => Promise<void>;
  query: UseMutationResult<any, Error | unknown, T>;
  isOpen?: boolean;
  setIsOpen?: Dispatch<SetStateAction<boolean>>;
};

export const AddItem = <T extends FieldValues>({
  type,
  value,
  onSubmit,
  query,
  isOpen,
  setIsOpen,
}: AddItemProps<T>) => {
  const formSchema = z.object({
    title: z.string().min(2, "Title must be at least 2 characters long"),
  });

  const form = useForm({
    mode: "onSubmit",
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: value ? value : "",
    },
  });

  const { isSuccess, isPending, isError, error } = query;

  useEffect(() => {
    if (isSuccess) form.reset();
  }, [isSuccess, form]);

  // Extraction de la logique de formulaire partagée
  const renderForm = () => (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={`flex gap-2 w-full p-3 rounded-xl animate-fade-in 
          ${setIsOpen ? type === "Checklist" ? "bg-gray-50 flex-col" : "bg-white flex-col" : "flex-row items-center"}
          `}
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormControl>
                <Input
                  placeholder={`${value ? "Update" : "Add"} a ${type.toLowerCase()}`}
                  {...field}
                  type="text"
                  className="h-10 rounded-xl border-none shadow-none bg-gray-200"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div
          className={`flex items-center gap-2 ${setIsOpen ? "w-full" : "w-fit"}`}
        >
          <SubmitButton isLoading={isPending}>
            <span className="flex items-center gap-2">
              {value ? <Pen size={16} /> : <Plus size={16} />}
              {value ? "Update" : "Add"} {type.toLowerCase()}
            </span>
          </SubmitButton>
          {!!setIsOpen && (
            <CloseButton setIsOpen={setIsOpen}/>
          )}
        </div>
        {isError && (
          <p className="text-xs font-bold border w-fit rounded bg-red-500 text-white py-2 px-3 uppercase self-center text-center">
            {error instanceof Error && error.message}
          </p>
        )}
      </form>
    </Form>
  );

  // Gestion de l'état d'ouverture avec setIsOpen
  return setIsOpen ? (
    isOpen ? (
      renderForm()
    ) : (
      <ToggleButton setIsOpen={setIsOpen}>
        <Plus size={16} />
        Add a {type.toLowerCase()}
      </ToggleButton>
    )
  ) : (
    renderForm()
  );
};

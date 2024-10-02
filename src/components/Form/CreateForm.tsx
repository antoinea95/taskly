import { zodResolver } from "@hookform/resolvers/zod";
import { FieldValues, Path, useForm } from "react-hook-form";
import { ZodType } from "zod";
import { Input } from "../ui/input";
import { Loader } from "../ui/loader";
import { Button } from "../ui/button";
import { UseMutationResult } from "@tanstack/react-query";
import { useEffect } from "react";
import { FormContent } from "@/utils/types";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";

type CreateFormProps<T extends FieldValues> = {
  schema: ZodType<Partial<T>>;
  onSubmit: (data: T) => Promise<void>;
  formContent: FormContent;
  buttonName: string;
  query: UseMutationResult<any, Error | unknown, T>;
};

export const CreateForm = <T extends FieldValues>({
  schema,
  onSubmit,
  formContent,
  buttonName,
  query,
}: CreateFormProps<T>) => {
  const form = useForm<T>({
    mode: "onSubmit",
    resolver: zodResolver(schema),
  });

  const { isError, error, isPending, isSuccess } = query;

  useEffect(() => {
    form.reset();
  }, [formContent, form.reset, form]);

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
        {formContent.map((item, index) => {
          if (item.hidden) return;
          return (
            <FormField
              key={index}
              control={form.control}
              name={item.name as Path<T>}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{item.label}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={item.placeholder}
                      {...field}
                      type={item.type}
                      className="h-10 rounded-xl bg-gray-200 border-none shadow-none"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          );
        })}
        <Button
          type="submit"
          disabled={isPending}
          className="uppercase py-6 rounded-xl w-full"
        >
          {isPending ? (
            <Loader data={{ color: "white", size: "1rem" }} />
          ) : (
            buttonName
          )}
        </Button>
        {isError && (
          <p className="text-sm font-bold w-fit text-red-500 self-center">
            {error instanceof Error && error?.message}
          </p>
        )}
      </form>
    </Form>
  );
};

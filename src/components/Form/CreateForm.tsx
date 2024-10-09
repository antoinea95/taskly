import { zodResolver } from "@hookform/resolvers/zod";
import { FieldValues, Path, useForm } from "react-hook-form";
import { z, ZodType } from "zod";
import { Input } from "../ui/input";
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
import { SubmitButton } from "../Button/SubmitButton";
import { Button } from "../ui/button";
import { StatusMessage } from "../Message/StatusMessage";

type CreateFormProps<T extends FieldValues> = {
  schema: ZodType<Partial<T>>;
  onSubmit: (data: Partial<T>) => Promise<void>;
  formContent: FormContent;
  buttonName: string;
  query: UseMutationResult<any, Error | unknown, any>;
  resetPassword?: (email: string) => Promise<void>;
};

export const CreateForm = <T extends FieldValues>({
  schema,
  onSubmit,
  formContent,
  buttonName,
  query,
  resetPassword,
}: CreateFormProps<T>) => {
  // Utilisation dans `useForm`
  const form = useForm<z.infer<typeof schema>>({
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
              name={item.name as Path<Partial<T>>}
              render={({ field }) => {
                return (
                  <FormItem>
                    <div className="flex items-center justify-between">
                    <FormLabel>{item.label}</FormLabel>
                    {resetPassword && item.name === "password" && (
                        <Button
                          className="rounded-xl border-none shadow-none w-fit h-fit p-0 bg-transparent underline text-black hover:bg-transparent"
                          type="button"
                          onClick={() =>
                            resetPassword(form.getValues().email as string)
                          }
                        >
                          Forgot your password ?
                        </Button>
                    )}
                    </div>
               
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
        })}
        <SubmitButton
          isLoading={query.isPending}
          disabled={isPending || Object.keys(form.getValues()).length === 0}
        >
          {buttonName}
        </SubmitButton>
        <StatusMessage
          isError={isError}
          isSucess={isSuccess}
          content={
            isError && error instanceof Error
              ? error?.message
              : isSuccess
                ? ""
                : ""
          }
        />
        {isError && (
          <p className="text-sm font-bold w-fit text-red-500 self-center"></p>
        )}
      </form>
    </Form>
  );
};

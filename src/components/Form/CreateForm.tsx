import { zodResolver } from "@hookform/resolvers/zod";
import { FieldValues, Path, useForm } from "react-hook-form";
import { ZodType } from "zod";
import { Input } from "../ui/input";
import { Loader } from "../ui/loader";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { UseMutationResult } from "@tanstack/react-query";
import { useEffect } from "react";
import { FormContent } from "@/utils/types";

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
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<T>({
    mode: "onSubmit",
    resolver: zodResolver(schema),
  });

  const { isError, error, isPending, isSuccess } = query;

  useEffect(() => {
    reset();
  }, [formContent, reset]);

  useEffect(() => {
    if (isSuccess) {
      reset();
    }
  }, [isSuccess, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col w-3/4 gap-6 h-fit">
      {formContent.map((item, index) => (
        <div
          key={index}
          className={`w-full flex flex-col gap-2 transition-height transition-opacity duration-300 ease-in-out ${
            item.hidden ? "opacity-0 max-h-0 overflow-hidden" : "max-h-full opacity-100"
          }`}
        >
          {item.label && (
            <Label
              htmlFor={item.name}
              className="text-lg uppercase font-extrabold"
            >
              {item.label}
            </Label>
          )}
          <Input
            type={item.type}
            id={item.name}
            {...register(item.name as Path<T>)}
            placeholder={item.placeholder}
            autoComplete="on"
            style={{
              borderColor: errors[item.name] ? "red" : "black",
            }}
          />
          {errors[item.name] && (
            <p className="text-xs font-bold  border w-fit rounded bg-red-600 text-white py-2 px-3 uppercase">
              {(errors[item.name] as { message?: string }).message || "Error"}
            </p>
          )}
        </div>
      ))}
      <Button
        type="submit"
        disabled={isPending}
        className="uppercase text-lg px-10 py-6"
      >
        {isPending ? (
          <Loader data={{ color: "white", size: "1rem" }} />
        ) : (
          buttonName
        )}
      </Button>
      {isError && (
        <p className="text-xs font-bold  border w-fit rounded bg-red-500 text-white py-2 px-3 uppercase self-center text-center">
          {error instanceof Error && error?.message}
        </p>
      )}
    </form>
  );
};

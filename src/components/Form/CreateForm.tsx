import { zodResolver } from "@hookform/resolvers/zod";
import { FieldValues, Path, useForm } from "react-hook-form";
import { ZodType } from "zod";
import { Input } from "../ui/input";
import { Loader } from "../ui/loader";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { UseMutationResult } from "@tanstack/react-query";
import { useEffect } from "react";
import { User } from "firebase/auth";

type CreateFormProps<T extends FieldValues> = {
  schema: ZodType<Partial<T>>;
  onSubmit: (data: T) => void;
  formContent: {
    name: string;
    type: string;
    placeholder: string;
    label?: string;
    value?: string;
  }[];
  buttonName: string;
  query: UseMutationResult<string | User, Error, T, unknown>

};

export const CreateForm = <T extends FieldValues>({
  schema,
  onSubmit,
  formContent,
  buttonName,
  query
}: CreateFormProps<T>) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<T>({
    mode: "onBlur",
    resolver: zodResolver(schema),
  });

  const {isError, error, isPending, isSuccess} = query

  useEffect(() => {
    if(isSuccess) {
     reset();
    }
  }, [isSuccess, reset])

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4"
    >
      {formContent.map((item, index) => (
        <div key={index}>
          {item.label && <Label htmlFor={item.name}>{item.label}</Label>}
          <Input
            type={item.type}
            id={item.name}
            {...register(item.name as Path<T>)}
            placeholder={item.placeholder}
            defaultValue={item?.value}
            autoComplete="true"
          />
          {errors[item.name] && (
            <small className="text-xs font-semibold text-red-600">
              {(errors[item.name] as { message?: string }).message || "Error"}
            </small>
          )}
        </div>
      ))}
      <Button type="submit">
        {isPending ? (
          <Loader data={{ color: "white", size:"1rem"}} />
        ) : (
          buttonName
        )}
      </Button>
      {isError && (
        <small className="text-xs font-semibold text-red-600 my-3 text-center">{error?.message}</small>
      )}
    </form>
  );
};

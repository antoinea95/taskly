import { zodResolver } from "@hookform/resolvers/zod";
import { FieldValues, Path, useForm } from "react-hook-form";
import { Input } from "../ui/input";
import { Loader } from "../ui/loader";
import { Button } from "../ui/button";
import { Dispatch, SetStateAction, useEffect } from "react";
import { z } from "zod";
import { UseMutationResult } from "@tanstack/react-query";
import { X } from "lucide-react";

type AddItemProps<T extends FieldValues> = {
  type: "Task" | "List";
  onSubmit: (data: T) => Promise<void>;
  query: UseMutationResult<any, Error | unknown, T>;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
};

export const AddItem = <T extends FieldValues>({
  type,
  onSubmit,
  query,
  setIsOpen
}: AddItemProps<T>) => {
  const formSchema = z.object({
    title: z.string().min(2),
  });
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<T>({
    mode: "onSubmit",
    resolver: zodResolver(formSchema),
  });

  const { isSuccess, isPending, isError, error } = query;

  useEffect(() => {
    if (isSuccess) {
      reset();
    }
  }, [isSuccess, reset]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col w-full gap-4 h-fit bg-white p-4 rounded-xl"
    >
      <div className="w-full flex flex-col gap-2 transition-height transition-opacity duration-300 ease-in-out">
        <Input
          type="text"
          id="title"
          {...register("title" as Path<T>)}
          placeholder={`${type} title`}
          autoComplete="on"
          style={{
            borderColor: errors.title ? "red" : "black",
          }}
          className="rounded-xl text-base font-outfit w-full"
        />
        {errors.title && (
          <p className="text-xs font-bold  border w-fit rounded-xl  text-white p-2 uppercase text-center">
            {(errors.title as { message?: string }).message || "Error"}
          </p>
        )}
      </div>
      <div className="flex items-center">
        <Button
          type="submit"
          disabled={isPending}
          className="uppercase px-3 py-5 rounded-xl flex-1"
        >
          {isPending ? (
            <Loader data={{ color: "white", size: "1rem" }} />
          ) : (
            `Create ${type}`
          )}
        </Button>
        <Button type="button" className="bg-transparent border-none shadow-none text-black hover:bg-transparent px-3 py-5 rounded-xl" onClick={()=> setIsOpen(false)}>
          <X />
        </Button>
      </div>
      {isError && (
        <p className="text-xs font-bold  border w-fit rounded bg-red-500 text-white py-2 px-3 uppercase self-center text-center">
          {error instanceof Error && error?.message}
        </p>
      )}
    </form>
  );
};

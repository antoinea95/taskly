import { zodResolver } from "@hookform/resolvers/zod";
import { FieldValues, Path, useForm } from "react-hook-form";
import { Input } from "../ui/input";
import { Loader } from "../ui/loader";
import { Button } from "../ui/button";
import { Dispatch, SetStateAction, useEffect } from "react";
import { z } from "zod";
import { UseMutationResult } from "@tanstack/react-query";
import { Plus, X } from "lucide-react";

type AddItemProps<T extends FieldValues> = {
  type: "Task" | "List" | "Checklist" | "Item";
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
    <>
      {isOpen ? (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className={`flex flex-col gap-2 h-fit pt-9 px-3 pb-3 rounded-xl relative ${type === "Checklist" ? "bg-gray-50" : "bg-white"}`}
        >
             <Button
              type="button"
              className="bg-transparent border-none shadow-none text-black hover:bg-transparent p-0 rounded-xl absolute right-3 top-1 hover:scale-125 transition-transform"
              onClick={() => setIsOpen(false)}
            >
              <X size={16} />
            </Button>
            <Input
              type="text"
              id="title"
              {...register("title" as Path<T>)}
              placeholder={`${type} title`}
              autoComplete="on"
              style={{
                borderColor: errors.title ? "red" : "black",
              }}
              className="rounded-xl text-base font-outfit w-full py-2 bg-gray-100 shadow-none border-none"
            />
            {errors.title && (
              <p className="text-xs font-bold w-fit rounded-xl  text-red-500">
                {(errors.title as { message?: string }).message || "Error"}
              </p>
            )}
            <Button
              type="submit"
              disabled={isPending}
              className="px-3 rounded-xl w-full"
            >
              {isPending ? (
                <Loader data={{ color: "white", size: "1rem" }} />
              ) : (
                <span className="flex items-center gap-2 text-xs">
                    <Plus size={16}/>
                    Add {type.toLowerCase()}
                </span>
              )}
            </Button>
          {isError && (
            <p className="text-xs font-bold  border w-fit rounded bg-red-500 text-white py-2 px-3 uppercase self-center text-center">
              {error instanceof Error && error?.message}
            </p>
          )}
        </form>
      ) : (
        <Button
          onClick={() => setIsOpen(true)}
          className="w-full py-6 rounded-xl bg-gray-50 text-black flex gap-2 shadow-none border-none hover:bg-black hover:text-white"
        >
          <Plus size={16} />
          Add a {type.toLowerCase()}
        </Button>
      )}
    </>
  );
};

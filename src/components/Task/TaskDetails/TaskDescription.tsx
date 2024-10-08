import { PenLine, X } from "lucide-react";
import { Textarea } from "../../ui/textarea";
import { Button } from "../../ui/button";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { TaskType } from "@/utils/types";
import { Loader } from "../../ui/loader";
import { UseMutationResult } from "@tanstack/react-query";

export const TaskDescription = ({
  description,
  query,
}: {
  query: UseMutationResult<any, unknown, Partial<TaskType> | undefined>
  description?: string;
  
}) => {
  const [isUpdate, setIsUpdate] = useState(false);
  const schema = z.object({
    description: z.string().min(1),
  });

  useEffect(() => {
    if (!description) {
      setIsUpdate(true);
    }
  }, [description]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    mode: "onSubmit",
    resolver: zodResolver(schema),
  });


  const onSubmit =  (data: Partial<TaskType>) => {
    query.mutate({
      description: data.description,
    }, {
        onSuccess: () => {
            setIsUpdate(false);
            reset();
        }
    });
  };

  return (
    <div className="flex flex-col gap-3 my-2">
      <h3 className="flex items-center gap-2 font-medium">
        <PenLine size={20} />
        Description
      </h3>
      {!isUpdate ? (
        <p onClick={() => setIsUpdate(true)} className="cursor-pointer font-medium bg-gray-50 px-2 py-3 rounded-xl hover:bg-gray-100">{description}</p>
      ) : (
        <form className="flex flex-col gap-3" onSubmit={handleSubmit(onSubmit)}>
          <Textarea
            className="min-h-24 resize-none border-none bg-gray-100 rounded-xl flex flex-start items-start px-4 py-3 ml-0.5"
            placeholder="Your description..."
            defaultValue={description}
            {...register("description")}
          />
           {errors.description && (
            <p className="text-xs font-bold w-fit  text-red-500 pb-3 uppercase text-center">
              {(errors.description as { message?: string }).message || "Error"}
            </p>
          )}
          <div className="flex items-center justify-between gap-2">
          <Button className="flex-1 min-w-32 rounded-xl flex items-center justify-center" type="submit">
            {query.isPending ? (
              <Loader data={{ color: "white", size: "1rem" }} />
            ) : (
              "Save"
            )}
          </Button>
          <Button className="w-fit p-3 flex items-center justify-center rounded-xl bg-transparent shadow-none border-none text-black hover:bg-gray-200" type="button" onClick={() => setIsUpdate(false)}>
            <X size={16}/>
          </Button>
          </div>

        </form>
      )}
    </div>
  );
};

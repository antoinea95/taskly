import { PenLine, X } from "lucide-react";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUpdateDoc } from "@/firebase/mutateHook";
import { TaskType } from "@/utils/types";
import { Loader } from "../ui/loader";

export const TaskDescription = ({
  taskId,
  description,
}: {
  taskId: string;
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

  const updateTask = useUpdateDoc<TaskType>("tasks","tasks", taskId);

  const onSubmit =  (data: Partial<TaskType>) => {
    updateTask.mutate({
      description: data.description,
    }, {
        onSuccess: () => {
            setIsUpdate(false);
            reset();
        }
    });
  };

  return (
    <div className="flex flex-col gap-3">
      <h3 className="flex items-center gap-2 font-medium text-xl">
        <PenLine />
        Description
      </h3>
      {!isUpdate ? (
        <p onClick={() => setIsUpdate(true)} className="cursor-pointer bg-gray-100 px-2 py-3 rounded-xl hover:bg-gray-300">{description}</p>
      ) : (
        <form className="flex flex-col gap-3" onSubmit={handleSubmit(onSubmit)}>
          <Textarea
            className="min-h-24 resize-none border-black rounded-xl flex flex-start items-start"
            placeholder="Your description..."
            defaultValue={description}
            {...register("description")}
          />
           {errors.description && (
            <p className="text-xs font-bold w-fit  text-red-500 pb-3 uppercase text-center">
              {(errors.description as { message?: string }).message || "Error"}
            </p>
          )}
          <div className="flex items-center gap-2">
          <Button className="w-fit min-w-32 rounded-xl flex items-center justify-center" type="submit">
            {updateTask.isPending ? (
              <Loader data={{ color: "white", size: "1rem" }} />
            ) : (
              "Save"
            )}
          </Button>
          <Button className="w-fit flex items-center justify-center rounded-xl" type="button" onClick={() => setIsUpdate(false)}>
            <X />
          </Button>
          </div>

        </form>
      )}
    </div>
  );
};

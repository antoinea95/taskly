import { Dispatch, SetStateAction } from "react";
import { useForm } from "react-hook-form";
import { ZodType } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUpdateDoc } from "@/firebase/mutateHook";
import { TaskType } from "@/utils/types";

interface useUpdateTaskProps<T> {
  taskId: string;
  schema: ZodType<Partial<T>>;
  setIsUpdate: Dispatch<SetStateAction<boolean>>;
}

export const useUpdateTask = <T,>({
  taskId,
  schema,
  setIsUpdate,
}: useUpdateTaskProps<T>) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    mode: "onSubmit",
    resolver: zodResolver(schema),
  });

  const updateTask = useUpdateDoc<TaskType>("tasks","tasks", taskId);

  const onSubmit = (data: Partial<TaskType>) => {
    updateTask.mutate(
      {
        ...data,
      },
      {
        onSuccess: () => {
          setIsUpdate(false);
          reset();
        },
      }
    );
  };

  return { register, handleSubmit, onSubmit, errors };
};

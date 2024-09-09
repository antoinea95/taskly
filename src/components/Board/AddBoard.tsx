import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useBoardStore } from "@/store/entityStore";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthStore } from "@/store/authStore";
import { Loader } from "../ui/loader";
import { useEffect, useState } from "react";

export const AddBoard = ({ closeModal }: { closeModal: () => void }) => {
  const { createItems, status, error } = useBoardStore();
  const { user } = useAuthStore();
  const isLoading = status === "loading";
  const isError = status === "error";
  const [isSuccess, setIsSuccess] = useState(false);

  const BoardSchema = z.object({
    title: z.string().min(2),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    mode: "onBlur",
    resolver: zodResolver(BoardSchema),
    defaultValues: {
      title: "",
    },
  });

  const onSubmit = (values: z.infer<typeof BoardSchema>) => {
    if (user) {
      createItems({ title: values.title, members: [user?.uid] });
      setIsSuccess(true);
    }
  };

  useEffect(() => {
    if (isSuccess && !isError) {
      closeModal();
      reset();
    }
  }, [closeModal, reset, isSuccess, isError]);

  return (
    <form
      className="flex justify-start items-center flex-col py-10"
      onSubmit={handleSubmit(onSubmit)}
    >
      <Input
        type="text"
        id="title"
        placeholder="Board title"
        className="w-full mb-1"
        {...register("title")}
      />
      {errors.title && (
        <small className="text-xs text-red-600 font-semibold">
          {errors.title.message}
        </small>
      )}
      <Button
        type="submit"
        className="w-full mt-4"
        disabled={isLoading || Object.keys(errors).length > 0}
      >
        {isLoading ? <Loader data={{ color: "white", size: "4" }} /> : "Create"}{" "}
      </Button>
      {isError && (
        <small className="text-xs text-red-600 font-semibold text-center mt-4">
          {error}
        </small>
      )}
    </form>
  );
};

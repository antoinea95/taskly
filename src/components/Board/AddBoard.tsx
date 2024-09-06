import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useBoardStore } from "@/store/entityStore";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthStore } from "@/store/authStore";
import { DialogTrigger } from "@/components/ui/dialog";

export const AddBoard = () => {
  const { createItems } = useBoardStore();
  const { user } = useAuthStore();

  const BoardSchema = z.object({
    title: z.string().min(1),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(BoardSchema),
    defaultValues: {
      title: "",
    },
  });

  const onSubmit = (values: z.infer<typeof BoardSchema>) => {
    if (user) {
      createItems({ title: values.title, members: [user?.uid] });
    }
  };

  return (
    <form
      className="flex justify-start items-center"
      onSubmit={handleSubmit(onSubmit)}
    >
      <Input
        type="text"
        id="title"
        placeholder="Board title"
        className="w-36 mr-3"
        {...register("title")}
      />
      <DialogTrigger asChild>
        <Button type="submit">Create</Button>
      </DialogTrigger>
    </form>
  );
};

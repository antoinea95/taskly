import { Pencil, Trash } from "lucide-react";
import { BoardType } from "../../utils/types";
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useBoardStore } from "@/store/entityStore";
import { useEffect, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";
import { Button } from "@/components/ui/button";
import { Loader } from "../ui/loader";

export const BoardCard = ({ board }: { board: BoardType }) => {
  const TitleSchema = z.object({
    title: z.string().min(3),
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onBlur",
    resolver: zodResolver(TitleSchema),
    defaultValues: {
      title: board.title,
    },
  });

  const [isUpdate, setIsUpdate] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { updateItems, deleteItems, status, error } = useBoardStore();
  const isLoading = status === "loading";
  const isError = status === "error";

  const onSubmit = (values: z.infer<typeof TitleSchema>) => {
    updateItems(board.id, values);
    setIsSuccess(true);
  };



  useEffect(() => {
    if(isSuccess && !isError) {
      setIsUpdate(false);
      setIsSuccess(false);
    }
  }, [isError, isSuccess])


  return (
    <Card className="w-72 h-32 flex flex-col justify-between overflow-hidden">
      {isUpdate ? (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col items-center justify-between gap-3 py-3 h-32"
        >
          <Input
            id="title"
            type="text"
            {...register("title")}
            className="border-black max-w-56"
          />
          {errors.title && (
            <small className="text-xs text-red-600 font-semibold">
              {errors.title.message}
            </small>
          )}
          <div className="flex items-center gap-2">
            <Button
              type="submit"
              className="px-7"
              disabled={isLoading || Object.keys(errors).length > 0}
            >
              {isLoading ? (
                <Loader data={{ color: "white", size: "4" }} />
              ) : (
                "Submit"
              )}
            </Button>
            <Button
              type="button"
              className="px-7"
              onClick={() => setIsUpdate(false)}
            >
              Cancel
            </Button>
          </div>
          {isError && (
            <small className="text-xs text-red-600 font-semibold text-center mt-1">
              {error}
            </small>
          )}
        </form>
      ) : (
        <>
          <CardHeader className="flex justify-center items-center pt-4">
            <CardTitle className="uppercase">{board.title}</CardTitle>
          </CardHeader>
          <CardFooter className="flex justify-center pb-3 gap-2">
            <Button onClick={() => setIsUpdate(true)}>
              <Pencil
                size={16}
                color="white"
                strokeWidth={2}
                className="mr-1"
              />
              Update
            </Button>
            <Button onClick={() => deleteItems(board.id)}>
              <Trash size={18} color="white" strokeWidth={2} className="mr-1" />
              Delete
            </Button>
          </CardFooter>
        </>
      )}
    </Card>
  );
};

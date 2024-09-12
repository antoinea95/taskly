import { Pencil, Trash } from "lucide-react";
import { BoardType } from "../../utils/types";
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "../Form/Form";
import { useDeleteDoc, useUpdateDoc } from "@/firebase/mutateHook";
import { Loader } from "../ui/loader";

export const BoardCard = ({ board }: { board: BoardType }) => {
  const TitleSchema = z.object({
    title: z.string().min(3),
  });

  const updateBoard = useUpdateDoc<BoardType>("boards", board.id);
  const deleteBoard = useDeleteDoc("boards", board.id);

  const [isUpdate, setIsUpdate] = useState(false);

  const onSubmit = (values: z.infer<typeof TitleSchema>) => {
    updateBoard.mutate(values);
  };

  useEffect(() => {
    if (updateBoard.isSuccess) {
      setIsUpdate(false);
    }
  }, [updateBoard.isSuccess]);

  const formContent = [
    {
      name: "title",
      type: "text",
      placeholder: "Board title",
      value: board.title,
    },
  ];

  return (
    <Card className="w-72 h-32 flex flex-col justify-between overflow-hidden">
      {isUpdate ? (
        <div className="h-full p-3 flex flex-col items-center justify-center">
          <Form
            schema={TitleSchema}
            formContent={formContent}
            onSubmit={onSubmit}
            buttonName="Update"
            isLoading={updateBoard.isPending}
            isError={updateBoard.isError}
            error={updateBoard.error}
          />
        </div>
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
            <Button onClick={() => deleteBoard.mutate()}>
              <Trash size={18} color="white" strokeWidth={2} className="mr-1" />
              {deleteBoard.isPending ? (
                <Loader data={{ color: "white", size: "1rem" }} />
              ) : (
                "Delete"
              )}
            </Button>
          </CardFooter>
        </>
      )}
    </Card>
  );
};

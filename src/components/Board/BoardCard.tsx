import { Pencil, Trash } from "lucide-react";
import { BoardType } from "../../utils/types";
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useBoardStore } from "@/store/entityStore";
import { useEffect, useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "../Form/Form";

export const BoardCard = ({ board }: { board: BoardType }) => {


  const TitleSchema = z.object({
    title: z.string().min(3),
  });

  const [isUpdate, setIsUpdate] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { updateItems, deleteItems, status, error } = useBoardStore();

  const onSubmit = (values: z.infer<typeof TitleSchema>) => {
    updateItems(board.id, values);
    setIsSuccess(true);
  };



  useEffect(() => {
    if(isSuccess && status !== "error") {
      setIsUpdate(false);
      setIsSuccess(false);
    }
  }, [status, isSuccess])

  const formContent = [{name: "title", type: "text", placeholder: "Board title", value: board.title}]



  return (
    <Card className="w-72 h-32 flex flex-col justify-between overflow-hidden">
      {isUpdate ? (
        <Form 
        schema={TitleSchema}
        formContent={formContent}
        onSubmit={onSubmit}
        buttonName="Update"
        status={status}
        error={error}
        />
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

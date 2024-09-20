import { z } from "zod";
import { CreateForm } from "../Form/CreateForm";
import { FormContent, ListType } from "@/utils/types";
import { Dispatch, SetStateAction } from "react";
import { X } from "lucide-react";
import { Button } from "../ui/button";
import { useAddDoc } from "@/firebase/mutateHook";

export const AddList = ({
  boardId,
  setIsAddList,
}: {
  boardId: string;
  setIsAddList: Dispatch<SetStateAction<boolean>>;
}) => {
  const createList = useAddDoc<ListType>("lists", boardId);
  const ListSchema = z.object({
    title: z.string().min(2),
  });

  const onSubmit = async (data: z.infer<typeof ListSchema>) => {
    createList.mutate({
      ...data,
      createdAt: Date.now(),
      tasks: [],
      boardId: boardId,
    }, {
      onSuccess: () => {
        setIsAddList(false);
      }
    });
  };

  const formContent: FormContent = [
    { name: "title", type: "text", placeholder: "Board title" },
  ];

  return (
    <div className="flex items-end justify-center p-4 rounded-xl border-black border gap-3 min-w-72">
      <CreateForm
        schema={ListSchema}
        onSubmit={onSubmit}
        formContent={formContent}
        buttonName="Create"
        query={createList}
      />
      <Button className="w-fit px-3" onClick={() => setIsAddList(false)}>
        <X size={18} />
      </Button>
    </div>
  );
};

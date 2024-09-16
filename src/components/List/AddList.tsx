import { z } from "zod";
import { Form } from "../Form/Form";
import { useAddDoc } from "@/firebase/mutateHook";
import { ListType } from "@/utils/types";
import { Dispatch, SetStateAction } from "react";
import { X } from "lucide-react";
import { Button } from "../ui/button";

export const AddList = ({
  boardId,
  setIsAddList,
}: {
  boardId: string;
  setIsAddList: Dispatch<SetStateAction<boolean>>;
}) => {
  const ListSchema = z.object({
    title: z.string().min(2),
  });

  const createList = useAddDoc<Omit<ListType, "id">>(`${boardId}, lists`, `boards/${boardId}/lists`);

  const onSubmit = async (value: z.infer<typeof ListSchema>) => {
    createList.mutate({title: value.title, createdAt: Date.now() });
  };

  const formContent = [
    { name: "title", type: "text", placeholder: "Board title" },
  ];

  return (
    <div className="flex items-end justify-center p-4 rounded-xl border-black border gap-3 min-w-72">
      <Form
        schema={ListSchema}
        onSubmit={onSubmit}
        formContent={formContent}
        buttonName="Create"
        isError={createList.isError}
        isLoading={createList.isPending}
        error={createList.error}
      />
      <Button className="w-fit px-3" onClick={() => setIsAddList(false)}>
        <X size={18} />
      </Button>
    </div>
  );
};

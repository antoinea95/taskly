import { z } from "zod";
import { CreateForm } from "../Form/CreateForm";
import { ListType } from "@/utils/types";
import { Dispatch, SetStateAction } from "react";
import { X } from "lucide-react";
import { Button } from "../ui/button";
import { useCreateItem } from "@/utils/useCreateItem";

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

  const { onSubmit, createItem } = useCreateItem<Omit<ListType, "id">>({
    schema: ListSchema,
    queryName: `${boardId}, lists`,
    databaseName: `boards/${boardId}/lists`,
    setIsOpen: setIsAddList,
  });

  const formContent = [
    { name: "title", type: "text", placeholder: "Board title" },
  ];

  return (
    <div className="flex items-end justify-center p-4 rounded-xl border-black border gap-3 min-w-72">
      <CreateForm
        schema={ListSchema}
        onSubmit={onSubmit}
        formContent={formContent}
        buttonName="Create"
        query={createItem}
      />
      <Button className="w-fit px-3" onClick={() => setIsAddList(false)}>
        <X size={18} />
      </Button>
    </div>
  );
};

import { z } from "zod";
import { Form } from "../Form/Form";
import { useAddDoc } from "@/firebase/mutateHook";
import { BoardType } from "@/utils/types";
import { useAuth } from "@/firebase/authHook";
import { Dispatch, SetStateAction, useEffect } from "react";

export const AddBoard = ({
  setIsModalOpen,
}: {
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const BoardSchema = z.object({
    title: z.string().min(2),
  });

  const { currentUser } = useAuth();

  const createBoard = useAddDoc<Omit<BoardType, "id">>("boards");
  const onSubmit = (value: z.infer<typeof BoardSchema>) => {
    if (currentUser) {
      createBoard.mutate({ title: value.title, members: [currentUser?.uid] });
    }
  };

  useEffect(() => {
    if (createBoard.isSuccess) {
      setIsModalOpen(false);
    }
  }, [createBoard.isSuccess, setIsModalOpen]);

  const formContent = [
    { name: "title", type: "text", placeholder: "Board title" },
  ];

  return (
    <div className="flex items-center justify-center py-10">
      <Form
        schema={BoardSchema}
        onSubmit={onSubmit}
        formContent={formContent}
        buttonName="Create"
        isError={createBoard.isError}
        isLoading={createBoard.isPending}
        error={createBoard.error}
      />
    </div>
  );
};

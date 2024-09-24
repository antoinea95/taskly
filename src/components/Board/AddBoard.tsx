import { z } from "zod";
import { CreateForm } from "../Form/CreateForm";
import { BoardType, FormContent, ListType } from "@/utils/types";
import { useAuth } from "@/firebase/authHook";
import { Dispatch, SetStateAction } from "react";
import { useAddDoc } from "@/firebase/mutateHook";

export const AddBoard = ({
  setIsModalOpen,
}: {
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const BoardSchema = z.object({
    title: z.string().min(2),
  });

  const { currentUser } = useAuth();
  const createBoard = useAddDoc<BoardType>("boards");
  const createList = useAddDoc<ListType>("lists");

  if (!currentUser) {
    return <p>Loading ...</p>;
  }

  const onSubmit = async (data: z.infer<typeof BoardSchema>) => {
    createBoard.mutate(
      {
        ...data,
        members: [currentUser.id],
        createdAt: Date.now(),
      },
      {
        onSuccess: async (boardId) => {
          setIsModalOpen(false);
          const now = Date.now();
          const defaultLists: Omit<ListType, "id">[] = [
            { title: "To do", createdAt: now, boardId: boardId, tasks: [] },
            {
              title: "In progress",
              createdAt: now + 1,
              boardId: boardId,
              tasks: [],
            },
            {
              title: "Finish",
              createdAt: now + 2,
              boardId: boardId,
              tasks: [],
            },
          ];
          await Promise.all(
            defaultLists.map((list) => createList.mutate(list))
          );


        },
      }
    );
  };

  const formContent: FormContent = [
    { name: "title", type: "text", placeholder: "Board title" },
  ];

  return (
    <div className="flex items-center justify-center py-10">
      <CreateForm
        schema={BoardSchema}
        onSubmit={onSubmit}
        formContent={formContent}
        buttonName="Create"
        query={createBoard}
      />
    </div>
  );
};

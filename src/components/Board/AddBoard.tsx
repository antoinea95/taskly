import { z } from "zod";
import { CreateForm } from "../Form/CreateForm";
import { BoardType, ListType } from "@/utils/types";
import { useAuth } from "@/firebase/authHook";
import { Dispatch, SetStateAction } from "react";
import FirestoreApi from "@/firebase/FirestoreApi";
import { useCreateItem } from "@/utils/useCreateItem";

export const AddBoard = ({
  setIsModalOpen,
}: {
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const BoardSchema = z.object({
    title: z.string().min(2),
  });

  const { currentUser } = useAuth();

  const { onSubmit, createItem } = useCreateItem<Omit<BoardType, "id">>({
    schema: BoardSchema,
    data: {members: currentUser ? [currentUser.uid] : [] },
    queryName: "boards",
    databaseName: "boards",
    setIsOpen: setIsModalOpen,
    onSuccessCallback: async (id?: string) => {
      if (id) {
        const now = Date.now();
        const defaultList: Omit<ListType, "id">[] = [
          { title: "To do", createdAt: now },
          { title: "In progress", createdAt: now + 1 },
          { title: "Finish", createdAt: now + 2 },
        ];

        await Promise.all(
          defaultList.map((list) =>
            FirestoreApi.createDocument<Omit<ListType, "id">>(
              `boards/${id}/lists`,
              list
            )
          )
        );
      }
    },
  });

  const formContent = [
    { name: "title", type: "text", placeholder: "Board title" },
  ];

  return (
    <div className="flex items-center justify-center py-10">
      <CreateForm
        schema={BoardSchema}
        onSubmit={onSubmit}
        formContent={formContent}
        buttonName="Create"
        query={createItem}
      />
    </div>
  );
};
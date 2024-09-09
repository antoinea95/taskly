import { useBoardStore } from "@/store/entityStore";
import { z } from "zod";
import { useAuthStore } from "@/store/authStore";
import { Form } from "../Form/Form";
import { useEffect, useState } from "react";

export const AddBoard = ({ closeModal }: { closeModal: () => void }) => {
  const { createItems, status, error } = useBoardStore();
  const { user } = useAuthStore();
  const [isSuccess, setIsSuccess] = useState(false);

  const BoardSchema = z.object({
    title: z.string().min(2),
  });

  const onSubmit = (values: z.infer<typeof BoardSchema>) => {
    if (user) {
      createItems({ title: values.title, members: [user?.uid] });
      setIsSuccess(true);
    }
  };

  useEffect(() => {
    if(isSuccess && status !== "error") {
      closeModal();
      setIsSuccess(false);
    }
  }, [closeModal, isSuccess, status])



  const formContent = [{name: "title", type: "text", placeholder: "Board title"}]

  return (
    <Form schema={BoardSchema} onSubmit={onSubmit} formContent={formContent} buttonName="Create" status={status} error={error}/>
  );
};

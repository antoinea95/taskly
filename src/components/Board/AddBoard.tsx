import { z } from "zod";
import { Form } from "../Form/Form";

export const AddBoard = ({ closeModal }: { closeModal: () => void }) => {

  const BoardSchema = z.object({
    title: z.string().min(2),
  });

  const onSubmit = (values: z.infer<typeof BoardSchema>) => {
  };




  const formContent = [{name: "title", type: "text", placeholder: "Board title"}]

  return (
    <div className="flex items-center justify-center py-10">
      <Form schema={BoardSchema} onSubmit={onSubmit} formContent={formContent} buttonName="Create"/>
    </div>
  );
};

import { useForm } from "react-hook-form";
import { Input } from "../ui/input";
import { useUpdateDoc } from "@/firebase/mutateHook";
import { BoardType } from "@/utils/types";
import { Dispatch, SetStateAction, useEffect} from "react";

interface UpdateFormProps {
  queryName: string,
  databaseName: string,
  id: string;
  value: string;
  isUpdate: boolean;
  setIsUpdate: Dispatch<SetStateAction<boolean>>;
}

export const UpdateForm = ({queryName, databaseName, id, value, isUpdate, setIsUpdate}: UpdateFormProps) => {

  const updateItem = useUpdateDoc(queryName, databaseName, id);

  const { register, handleSubmit } = useForm();

  const onSubmit = (values: Partial<BoardType>) => {
    updateItem.mutate(values, {
      onSuccess: () => {
        setIsUpdate(false);
      },
    });
  };

  useEffect(() => {
    if (isUpdate) {
      const input = document.getElementById("title") as HTMLInputElement;
      if (input) {
        input.select();
      }
    }
  }, [isUpdate]);

  return (
    <>
      {!isUpdate ? (
        <button
          className="text-xl uppercase font-bold h-12 rounded px-3 py-2 cursor-pointer hover:bg-gray-200"
          onClick={() => setIsUpdate(true)}
          aria-label="Update board title"
        >
          {value}
        </button>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)}>
          <Input
            className="text-xl uppercase font-bold max-w-40 h-12 border rounded px-3 py-2 cursor-pointer text-center selection:bg-blue-400"
            {...register("title")}
            id="title"
            type="text"
            aria-label="Input for update board title"
            defaultValue={value}
          />
        </form>
      )}
    </>
  );
};

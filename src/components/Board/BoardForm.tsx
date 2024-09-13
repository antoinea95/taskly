import { useForm } from "react-hook-form";
import { Input } from "../ui/input";
import { useUpdateDoc } from "@/firebase/mutateHook";
import { BoardType } from "@/utils/types";
import { Dispatch, SetStateAction, useEffect} from "react";

interface BoardForm {
  boardId: string;
  value: string;
  isBoardTitleUpdate: boolean;
  setIsBoardTitleUpdate: Dispatch<SetStateAction<boolean>>;
}

export const BoardForm = ({ boardId, value, isBoardTitleUpdate, setIsBoardTitleUpdate}: BoardForm) => {

  const updateBoard = useUpdateDoc("boards", boardId);

  const { register, handleSubmit } = useForm();

  const onSubmit = (values: Partial<BoardType>) => {
    updateBoard.mutate(values, {
      onSuccess: () => {
        setIsBoardTitleUpdate(false);
      },
    });
  };

  useEffect(() => {
    if (isBoardTitleUpdate) {
      const input = document.getElementById("title") as HTMLInputElement;
      if (input) {
        input.select();
      }
    }
  }, [isBoardTitleUpdate]);

  return (
    <>
      {!isBoardTitleUpdate ? (
        <button
          className="text-xl uppercase font-bold w-36 h-12 rounded px-3 py-2 cursor-pointer hover:bg-gray-200"
          onClick={() => setIsBoardTitleUpdate(true)}
          aria-label="Update board title"
        >
          {value}
        </button>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)}>
          <Input
            className="text-xl uppercase font-bold w-36 h-12 border rounded px-3 py-2 cursor-pointer text-center selection:bg-blue-400"
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

import { useAddDoc } from "@/firebase/mutateHook";
import { Dispatch, SetStateAction } from "react";
import { z, ZodType } from "zod";

interface UseCreateItemProps<T> {
  schema: ZodType<Partial<T>>;
  data?: Partial<Omit<T, "id">>; // Assurez-vous que c'est bien ce type
  databaseName: string;
  queryName: string;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  onSuccessCallback?: (id?: string) => void;
}

export function useCreateItem<T>({
  schema,
  data,
  queryName,
  databaseName,
  setIsOpen,
  onSuccessCallback,
}: UseCreateItemProps<T>) {
  const createItem = useAddDoc<T>(queryName, databaseName);

  const onSubmit = async (values: z.infer<typeof schema>) => {
    const parsed = schema.parse(values);
    createItem.mutate(
      {
        createdAt: Date.now(),
        ...parsed,
        ...data,
      } as T,
      {
        onSuccess: (id) => {
          setIsOpen(false);
          if (onSuccessCallback) onSuccessCallback(id);
        },
      }
    );
  };

  return {
    onSubmit,
    createItem,
  };
}

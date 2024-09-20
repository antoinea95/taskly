import { useMutation, useQueryClient, UseMutationResult } from "@tanstack/react-query";
import FirestoreApi from "./FirestoreApi";

type WhitoutId<T> = Omit<T, 'id'>;


export const useFirestoreMutation = <T,>(
  mutationFn: (data: T) => Promise<any>,
  queryKey: string[],
  onSuccessCallback?: () => void,
): UseMutationResult<any, unknown, T> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    onError: (err) => {
      console.error('Mutation error:', err);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey});
      if (onSuccessCallback) onSuccessCallback();
    },
  });
};

export const useAddDoc = <T,>(collectionName: string, parentId?: string) => {
  return useFirestoreMutation<WhitoutId<T>>(
    (data: WhitoutId<T>) => FirestoreApi.createDocument<T>(collectionName, data),
    parentId ? [collectionName, parentId] : [collectionName]
  );
};

export const useUpdateDoc = <T,>(
  collectionName: string,
  documentId: string,
  parentId?: string
) => {
  return useFirestoreMutation<Partial<T>>(
    (  data: Partial<T> ) => FirestoreApi.updateDocument<T>(collectionName, data, documentId),
    parentId ? [collectionName, parentId] : [collectionName, documentId]
  );
};

export const useDeleteDoc = (
  collectionName: string,
  id: string,
  parentId?: string
) => {
  return useFirestoreMutation(
    () => FirestoreApi.deleteDocument(collectionName, id),
    parentId ? [collectionName, parentId] : [collectionName]
  );
};

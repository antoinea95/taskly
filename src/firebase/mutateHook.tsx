import { useMutation, useQueryClient, UseMutationResult } from "@tanstack/react-query";
import FirestoreApi from "./FirestoreApi";

type WhitoutId<T> = Omit<T, 'id'>;

export const useFirestoreMutation = <T,>(
  mutationFn: (data: T) => Promise<any>,
  queryKey: string[],
): UseMutationResult<any, unknown, T> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });
};

// Hook pour ajouter un document
export const useAddDoc = <T,>(queryName: string, collectionName: string, parentId?: string) => {
  const queryKey = parentId ? [queryName, parentId] : [queryName];

  return useFirestoreMutation<WhitoutId<T>>(
    (data: WhitoutId<T>) => FirestoreApi.createDocument<T>(collectionName, data),
    queryKey,
  );
};

// Hook pour mettre à jour un document
export const useUpdateDoc = <T,>(
  queryName: string,
  collectionName: string,
  documentId: string,
  parentId?: string
) => {
  const queryKey = parentId ? [queryName, parentId] : [queryName, documentId];

  return useFirestoreMutation<Partial<T>>(
    (data: Partial<T>) => FirestoreApi.updateDocument<T>(collectionName, data, documentId),
    queryKey,
  );
};

// Hook pour supprimer un document
export const useDeleteDoc = (
  queryName: string,
  collectionName: string,
  id: string,
  parentId?: string
) => {
  const queryKey = parentId ? [queryName, parentId] : [queryName];

  return useFirestoreMutation<string[] | undefined>(
    (subCollections:string[] = []) => FirestoreApi.deleteDocument(collectionName, id, subCollections),
    queryKey,
  );
};
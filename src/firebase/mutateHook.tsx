import { useMutation, useQueryClient, UseMutationResult } from "@tanstack/react-query";
import FirestoreApi from "./FirestoreApi";

type WithoutId<T> = Omit<T, 'id'>;

// Hook générique pour les mutations avec vérification d'ID
export const useFirestoreMutation = <T,>(
  mutationFn: (data: T) => Promise<any>,
  queryKey: (string| undefined)[],
): UseMutationResult<any, unknown, T> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    onSuccess: () => {
      console.log(queryKey)
      queryClient.invalidateQueries({ queryKey });
    },
    onError: (error) => {
      console.error("Mutation error:", error);
    },
  });
};

// Hook pour ajouter un document
export const useAddDoc = <T,>(queryName: string, collectionName: string, parentId?: string) => {
  const queryKey = parentId ? [queryName, parentId] : [queryName];

  return useFirestoreMutation<WithoutId<T>>(
    (data: WithoutId<T>) => FirestoreApi.createDocument<T>(collectionName, data),
    queryKey,
  );
};

// Hook pour mettre à jour un document
export const useUpdateDoc = <T,>(
  queryName: string,
  collectionName: string,
  documentId?: string,
  parentId?: string,
) => {

  const queryKey = parentId ? [queryName, parentId] : [queryName, documentId];
  return useFirestoreMutation<Partial<T>>(
    (data: Partial<T>) => {
      if(documentId) {
        return FirestoreApi.updateDocument<T>(collectionName, data, documentId)
      }
      return Promise.reject(new Error("Document ID is not defined"));
    },
    queryKey,
  );
};

// Hook pour supprimer un document
export const useDeleteDoc = (
  queryName: string,
  collectionName: string,
  id?: string,
  parentId?: string
) => {
  const queryKey = parentId ? [queryName, parentId] : [queryName];

  return useFirestoreMutation<string[] | undefined>(
    (subCollections:string[] = []) => {
      if(id) {
        return FirestoreApi.deleteDocument(collectionName, id, subCollections)
      }
      return Promise.reject(new Error("Document ID is not defined"));
    },
    queryKey
  );
};
import { useMutation, useQueryClient, UseMutationResult } from "@tanstack/react-query";
import FirestoreApi from "./FirestoreApi";

type WithoutId<T> = Omit<T, 'id'>;

// Hook générique pour les mutations avec vérification d'ID
export const useFirestoreMutation = <T,>(
  mutationFn: (data?: T | undefined) => Promise<any>,
  queryKey: (string| undefined)[],
  queryCollection?: string[]
): UseMutationResult<any, unknown, T | undefined> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      if(queryCollection) {
        queryClient.invalidateQueries({queryKey: queryCollection})
      }
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
    (data?: WithoutId<T>) => {
      if(data) {
        return FirestoreApi.createDocument<T>(collectionName, data)
      }
      return Promise.reject(new Error("No data"));
    },
    queryKey,
  );
};

// Hook pour mettre à jour un document
export const useUpdateDoc = <T,>(
  queryName: string,
  collectionName: string,
  documentId?: string,
  parentId?: string,
  queryCollection?:string[],
) => {

  const queryKey = parentId ? [queryName, parentId] : [queryName, documentId];
  return useFirestoreMutation<Partial<T>>(
    (data?: Partial<T>) => {
      if(documentId && data) {
        return FirestoreApi.updateDocument<T>(collectionName, data, documentId)
      }
      return Promise.reject(new Error("Document ID is not defined or no data"));
    },
    queryKey,
    queryCollection
  );
};

export const useUploadProfilePic = (
  queryName: string,
  file: File | null,
  documentId?: string,
) => {
  const queryKey = [queryName, documentId];
  return useFirestoreMutation<void>(
    () => {
      if(documentId && file) {
        return FirestoreApi.ImportFile(file, documentId)
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
  parentId?: string,
) => {
  const queryKey = parentId ? [queryName, parentId] : [queryName];

  return useFirestoreMutation<void>(
    () => {
      if(id) {
        return FirestoreApi.deleteDocument(collectionName, id)
      }
      return Promise.reject(new Error("Document ID is not defined"));
    },
    queryKey
  );
};


export const useDeleteBoard = (
  userId?: string,
  id?: string,
) => {

  return useFirestoreMutation<void>(
    () => {
      if(id) {
        return FirestoreApi.deleteBoard(id)
      }
      return Promise.reject(new Error("Document ID is not defined"));
    },
    ["boards", userId]
  );
};

export const useDeleteList = (
  boardId: string,
  id?: string,
) => {
  return useFirestoreMutation<void>(
    () => {
      if(id) {
        return FirestoreApi.deleteList(id)
      }
      return Promise.reject(new Error("Document ID is not defined"));
    },
    ["lists", boardId]
  );
};


export const useDeleteTask = (
  id?: string,
) => {
  return useFirestoreMutation<void>(
    () => {
      if(id) {
        return FirestoreApi.deleteTask(id)
      }
      return Promise.reject(new Error("Document ID is not defined"));
    },
    ["tasks", id]
  );
};

export const useDeleteChecklist = (
  taskId: string,
  id?: string,
) => {

  return useFirestoreMutation<void>(
    () => {
      if(id) {
        return FirestoreApi.deleteCheckList(id, taskId)
      }
      return Promise.reject(new Error("Document ID is not defined"));
    },
    ["checklists", taskId]
  );
};
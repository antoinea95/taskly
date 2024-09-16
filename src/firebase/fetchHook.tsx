import {
  useQuery,
  useQueryClient,
  UseQueryOptions,
  UseQueryResult,
} from "@tanstack/react-query";
import { useEffect } from "react";
import FirestoreApi from "./FirestoreApi";
import { BoardType, ListType, TaskType } from "@/utils/types";

type FetchMethod<T> = () => Promise<T>;

interface UseFireStoreApiParams<T> {
  queryName: string;
  databaseName: string;
  documentId?: string;
  fetchMethod?: FetchMethod<T>;
  useQueryOptions?: UseQueryOptions<T>;
}

const useFireStoreApi = <T,>({
  queryName,
  databaseName,
  documentId,
  fetchMethod,
  useQueryOptions,
}: UseFireStoreApiParams<T>): UseQueryResult<T> => {
  const queryClient = useQueryClient();


  useEffect(() => {
      const unsubscribe = FirestoreApi.subscribe<T>({
        databaseName: databaseName,
        documentId: documentId,
        callback: (data) => {
          console.log("Firestore data received:", data);
          queryClient.setQueryData(documentId ? [queryName, documentId] : [queryName], data);
        },
      });

      return () => {
        console.log("Unsubscribing from Firestore");
        unsubscribe();
      };

  }, [databaseName, queryName, documentId, queryClient]);

  return useQuery<T>({
    queryKey: documentId ? [queryName, documentId] : [queryName],
    queryFn: fetchMethod
      ? fetchMethod
      : () => Promise.reject("No fetch method provided"),
    ...useQueryOptions,
  });
};

export const useFetchBoards = () => {
  return useFireStoreApi<BoardType[]>({
    queryName: "boards",
    databaseName: "boards",
    fetchMethod: async () => FirestoreApi.fetchBoards(),
  });
};

export const useFetchLists = (boardId: string) => {
  return useFireStoreApi<ListType[]>({
    queryName: `${boardId}, lists`,
    databaseName: `boards/${boardId}/lists`,
    fetchMethod: async () => FirestoreApi.fetchLists(boardId),
  });
};

export const useFetchTasks = (boardId: string, listId: string) => {
  return useFireStoreApi<TaskType[]>({
    queryName: `${listId}, tasks`,
    databaseName: `boards/${boardId}/lists/${listId}/tasks`,
    fetchMethod: async () => FirestoreApi.fetchTasks(boardId, listId),
  });
};

export const useFetchDoc = <T,>(queryName: string, databaseName: string, documentId: string) => {
  return useFireStoreApi<T>({
    queryName: queryName,
    databaseName: databaseName,
    documentId: documentId,
    fetchMethod: async () =>
      FirestoreApi.fetchDoc<T>({ databaseName, documentId }),
  });
};

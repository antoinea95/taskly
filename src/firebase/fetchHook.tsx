import {
  useQuery,
  useQueryClient,
  UseQueryOptions,
  UseQueryResult,
} from "@tanstack/react-query";
import { useEffect } from "react";
import FirestoreApi from "./FirestoreApi";
import { BoardType, ListType, TaskType } from "@/utils/types";
import { CollectionReference, query, where } from "firebase/firestore";

type FetchMethod<T> = () => Promise<T>;
type SubscribeParams = {
  collectionName: string;
  queryFn?: (colRef: CollectionReference) => any;
  documentId?: string;
};

interface UseFireStoreApiParams<T> {
  collectionName: string;
  documentId?: string;
  fetchMethod?: FetchMethod<T>;
  subscribeParams: SubscribeParams;
  useQueryOptions?: UseQueryOptions<T>;
}

const useFireStoreApi = <T,>({
  collectionName,
  documentId,
  fetchMethod,
  subscribeParams,
  useQueryOptions,
}: UseFireStoreApiParams<T>): UseQueryResult<T> => {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (subscribeParams) {
      const queryKey = documentId ? [collectionName, documentId] : [collectionName];
      const unsubscribe = FirestoreApi.subscribe<T>({
        collectionName: collectionName,
        documentId: documentId,
        queryFn: subscribeParams.queryFn,
        callback: (data) => {
          queryClient.setQueryData(queryKey, data);
        },
      });

      return () => {
        unsubscribe();
      };
    }
  }, [collectionName, queryClient, documentId, subscribeParams]);

  return useQuery<T>({
    queryKey: documentId ? [collectionName, documentId] : [collectionName],
    queryFn: fetchMethod
      ? fetchMethod
      : () => Promise.reject("No fetch method provided"),
    ...useQueryOptions,
  });
};

export const useFetchBoards = () => {
  return useFireStoreApi<BoardType[]>({
    collectionName: "boards",
    fetchMethod: async () => FirestoreApi.fetchBoards(),
    subscribeParams: {
      collectionName: "boards",
      queryFn: (colRef) =>
        query(
          colRef,
          where("members", "array-contains", FirestoreApi.getCurrentUser()?.uid)
        ),
    },
  });
};

export const useFetchLists = (boardId: string) => {
  return useFireStoreApi<ListType[]>({
    collectionName: "lists",
    fetchMethod: async () => FirestoreApi.fetchLists(boardId),
    subscribeParams: {
      collectionName: "lists",
      queryFn: (colRef) => query(colRef, where("boardId", "==", boardId)),
    },
  });
};

export const useFetchTasks = (listId: string) => {
  return useFireStoreApi<TaskType[]>({
    collectionName: "tasks",
    fetchMethod: async () => FirestoreApi.fetchTasks(listId),
    subscribeParams: {
      collectionName: "tasks",
      queryFn: (colRef) => query(colRef, where("boardId", "==", listId)),
    },
  });
};

export const useFetchDoc = <T,>(collectionName: string, documentId: string) => {
  return useFireStoreApi<T>({
    collectionName: collectionName,
    documentId: documentId,
    fetchMethod: async () =>
      FirestoreApi.fetchDoc<T>({ collectionName, documentId }),
    subscribeParams: {
      collectionName: collectionName,
      documentId: documentId,
    },
  });
};

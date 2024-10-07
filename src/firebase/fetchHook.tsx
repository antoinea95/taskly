import { useQuery } from "@tanstack/react-query";
import FirestoreApi from "./FirestoreApi";
import {
  BoardType,
  CheckListItemType,
  CheckListType,
  ListType,
  TaskType,
  UserType,
} from "@/utils/types";
import {
  CollectionReference,
  documentId,
  where,
  query as firestoreQuery,
} from "firebase/firestore";

interface FirestoreQueryParams<T> {
  collectionName: string;
  queryKey: any[];
  queryFn?: (colRef: CollectionReference) => any;
  documentId?: string;
  transformFn?: (data: T[]) => T[]; // Optionnel, pour transformer les données si besoin
  enabled?: boolean;
}

export const useFirestoreQuery = <T,>({
  collectionName,
  queryKey,
  queryFn,
  documentId,
  transformFn,
  enabled = true,
}: FirestoreQueryParams<T>) => {
  const cacheKey = queryKey;
  
  return useQuery({
    queryKey: cacheKey,
    queryFn: async () => {
      if (documentId) {
        const doc = await FirestoreApi.fetchDoc<T>({
          collectionName,
          documentId,
        });
        if (!doc) {
          throw new Error(`Document with ID ${documentId} not found`);
        }
        return doc as T;
      } else {
        // Sinon, on fait une requête sur la collection
        return new Promise<T>((resolve) => {
          const unsubscribe = FirestoreApi.subscribeToCollection<T>({
            collectionName,
            queryFn: queryFn
              ? (colRef) => firestoreQuery(colRef, ...queryFn(colRef))
              : undefined,
            callback: (data) => resolve(transformFn ? transformFn(data) as T : data as T),
            errorMessage: `Error while getting data from ${collectionName}`,
          });

          return () => unsubscribe;
        });
      }
    },
    staleTime: Infinity,
    enabled, // Permet de conditionner l'exécution (utile pour les ID optionnels)
  });
};

export const useGetUsers = () => {
  return useFirestoreQuery<UserType>({
    collectionName: "users",
    queryKey: ["users"],
  });
};

export const useGetBoards = (userId?: string) => {
  return useFirestoreQuery<BoardType[]>({
    collectionName: "boards",
    queryKey: ["boards", userId],
    queryFn: () => [where("members", "array-contains", userId)],
    enabled: !!userId, // Ne fait la requête que si userId est défini
  });
};

export const useGetLists = (boardId?: string) => {
  return useFirestoreQuery<ListType[]>({
    collectionName: "lists",
    queryKey: ["lists", boardId],
    queryFn: () => [where("boardId", "==", boardId)],
    enabled: !!boardId,
  });
};

export const useGetChecklists = (taskId: string) => {
  return useFirestoreQuery<CheckListType[]>({
    collectionName: `tasks/${taskId}/checklists`,
    queryKey: ["checklists", taskId],
    enabled: !!taskId,
  });
};

export const useGetChecklistItems = (taskId: string, checklistId: string) => {
  return useFirestoreQuery<CheckListItemType[]>({
    collectionName: `tasks/${taskId}/checklists/${checklistId}/items`,
    queryKey: ["checklistItems", checklistId],
    enabled: !!taskId,
  });
};

export const useGetTasks = (taskIds: string[], listId: string) => {
  return useFirestoreQuery<TaskType[]>({
    collectionName: "tasks",
    queryKey: ["tasks", listId],
    queryFn: () => [where(documentId(), "in", taskIds)],
  });
};

export const useGetDoc = <T,>(collectionName: string, id?: string) => {
  return useFirestoreQuery<T>({
    collectionName: collectionName,
    documentId: id,
    queryKey: [
      collectionName.endsWith("s")
        ? collectionName.slice(0, -1)
        : collectionName,
      id,
    ],
    enabled: !!id,
  });
};

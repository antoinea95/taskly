import { useQuery } from "@tanstack/react-query";
import FirestoreApi from "./FirestoreApi";
import { BoardType, ListType, TaskType } from "@/utils/types";
import { query, where } from "firebase/firestore";

export const useGetBoards = (userId?: string) => {
  return useQuery({
    queryKey: ["boards", userId], // Ajoute userId dans la clé de la requête pour éviter des doublons
    queryFn: () => {
      if (!userId) {
        return Promise.resolve([]); // Si userId est indéfini ou null, retourne un tableau vide
      }

      return new Promise<BoardType[]>((resolve) => {
        const unsubscribe = FirestoreApi.subscribeToCollection<BoardType>({
          collectionName: "boards",
          queryFn: (colRef) =>
            query(colRef, where("members", "array-contains", userId)),
          callback: (boards) => resolve(boards),
          errorMessage: "Error while getting boards",
        });

        return () => unsubscribe;
      });
    },
    staleTime: Infinity,
    enabled: !!userId,
  });
};

export const useGetLists = (boardId?: string) => {
  return useQuery({
    queryKey: ["lists", boardId],
    queryFn: () => {
      if (!boardId) {
        return Promise.resolve([]);
      }
      return new Promise<ListType[]>((resolve) => {
        const unsubscribe = FirestoreApi.subscribeToCollection<ListType>({
          collectionName: "lists",
          queryFn: (colRef) => query(colRef, where("boardId", "==", boardId)),
          callback: (lists) => resolve(lists),
          errorMessage: "Error while getting lists",
        });

        return () => unsubscribe;
      });
    },
    staleTime: Infinity,
    enabled: !!boardId
  });
};

export const useGetTask = (taskId: string) => {
  return useQuery({
    queryKey: ["tasks", taskId],
    queryFn: () =>
      new Promise<TaskType>((resolve, reject) => {
        const unsubscribe = FirestoreApi.subscribeToDocument<TaskType>({
          collectionName: "tasks",
          documentId: taskId,
          callback: (task) => {
            if (task) {
              resolve(task);
            } else {
              reject(new Error(`Task with ID ${taskId} not found`));
            }
          },
          errorMessage: "Error getting task",
        });
        return () => unsubscribe;
      }),
    staleTime: Infinity,
  });
};

export const useGetDoc = <T,>(collectionName: string, id?: string) => {
  return useQuery<T | null>({
    queryKey: [collectionName.endsWith('s') ? collectionName.slice(0, -1) : collectionName, id],
    queryFn: async () => {
      if (!id) {
        return null; // Retourne `null` si l'ID est absent
      }
      return FirestoreApi.fetchDoc({ collectionName, documentId: id });
    },
    staleTime: Infinity,
    enabled: !!id // Exécute la requête uniquement si l'ID est présent
  });
};

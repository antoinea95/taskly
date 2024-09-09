import { create } from "zustand";
import { BoardType, ErrorType, ListType, StatusType, TaskType } from "../utils/types";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase/firebase";
import { getFriendlyErrorMessage } from "@/utils/error";

type EntityState<T> = {
  items: T[];
  status: StatusType;
  error: ErrorType;
};

type EntityAction<T> = {
  createItems: (data: Omit<T, "id">) => void;
  getItems: () => void;
  updateItems: (id: string, data: Partial<T>) => void;
  deleteItems: (id: string) => void;
};

/**
 *
 * @param collectionName for firebase database
 * @returns create store function to handle CRUD Operation with firestore
 */
export const createStore = <T extends { id: string }>(
  collectionName: string
) => {
  return create<EntityState<T> & EntityAction<T>>((set, get) => ({
    items: [],
    status: null,
    error: null,

    createItems: async (data: Omit<T, "id">) => {
      set((state) => ({ ...state, status: "loading", error: null }));
      try {
        const ref = collection(db, collectionName);
        await addDoc(ref, data);
        get().getItems()
      } catch (err: any) {
        const friendlyMessage = getFriendlyErrorMessage(err.code);
        set((state) => ({ ...state, status: "error", error: friendlyMessage }));
      }
    },

    getItems: async () => {

      set((state) => ({ ...state, status: "loading", error: null }));

      try {
        const snap = await getDocs(collection(db, collectionName));
        const items: T[] = snap.docs.map(
          (doc) => ({ id: doc.id, ...doc.data() }) as T
        );
        set({
          items: items,
          status: "success",
          error: null,
        });
      } catch (err: any) {
        const friendlyMessage = getFriendlyErrorMessage(err.code);
        set((state) => ({ ...state, status: "error", error: friendlyMessage }));
      }
    },

    updateItems: async (id: string, data: Partial<T>) => {
      set((state) => ({ ...state, status: "loading", error: null }));
      try {
        const ref = doc(db, collectionName, id);
        await updateDoc(ref, data as T);
        get().getItems();
      } catch (err: any) {
        const friendlyMessage = getFriendlyErrorMessage(err.code);
        set((state) => ({ ...state, status: "error", error: friendlyMessage }));
      }
    },

    deleteItems: async (id: string) => {
      set((state) => ({ ...state, status: "loading", error: null }));
      try {
        const ref = doc(db, collectionName, id);
        await deleteDoc(ref);
        get().getItems()
      } catch (err: any) {
        const friendlyMessage = getFriendlyErrorMessage(err.code);
        set((state) => ({ ...state, status: "error", error: friendlyMessage }));
      }
    },
  }));
};

export const useBoardStore = createStore<BoardType>("boards");
export const useListStore = createStore<ListType>("lists");
export const useTaskStore = createStore<TaskType>("tasks");

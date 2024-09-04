import { create } from "zustand";
import { Board, Error, List, Status, Task } from "../utils/types";
import { addDoc, collection, deleteDoc, doc, getDocs, updateDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";

type EntityState<T> = {
  items: T[];
  status: Status;
  error: Error;
};

type EntityAction<T> = {
  createItems: (data: Omit<T, 'id'>) => void;
  getItems: () => void;
  updateItems: (id: string, data: Partial<T>) => void;
  deleteItems: (id: string) => void;
};

export const createStore = <T extends {id: string}> (collectionName: string) => { 
    
    return create<EntityState<T> & EntityAction<T>>((set) => ({
    items: [],
    status: null,
    error: null,

    createItems: async (data: Omit<T, 'id'>) => {
        set({ status: "loading", error: null });
        try {
            const ref = collection(db, collectionName);
            await addDoc(ref, data)
        } catch(err: any) {
            set({
                status: 'error',
                error: err.message
            })
        }
    },

    getItems: async () => {
        set({ status: "loading", error: null });
        try {
            const snap = await getDocs(collection(db, collectionName));
            const items : T[] = snap.docs.map((doc) => ({id: doc.id, ...doc.data()} as T));
            set({
                items: items,
                status: "success",
                error: null
            })
        } catch(err: any) {
            set({
                status: "error",
                error: err.message
            })
        }
    },

    updateItems: async (id: string, data: Partial<T>) => {
        set({ status: "loading", error: null });
        try {
            const ref = doc(db, collectionName, id);
            await updateDoc(ref, data as T);

        } catch(err: any) {
            set({
                status: "error",
                error: err.message
            })
        }
    },

    deleteItems: async (id: string) => {
        set({ status: "loading", error: null });
        try {
            const ref = doc(db, 'boards', id);
            await deleteDoc(ref);

        } catch(err: any) {
            set({
                status: "error",
                error: err.message
            })
        }
    },

}))};


export const useBoardStore = createStore<Board>("boards");
export const useListStore = createStore<List>("lists");
export const useTaskStore = createStore<Task>("tasks");

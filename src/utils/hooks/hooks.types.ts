import { CollectionReference, QueryConstraint } from "firebase/firestore";

export type WithoutId<T> = Omit<T, "id">;

export type UseFirestoreQueryProps = {
  collectionName: string;
  key: any[];
  documentId?: string;
  filterFn?: (colRef: CollectionReference) => QueryConstraint[];
  enabled?: boolean;
};

export type SignInData =  {
    email: string;
    password: string;
    name?: string;
  }

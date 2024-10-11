import { useFirestoreQuery } from "./useFirestoreQuery";




export const useGetDoc = <T,>(collectionName: string, id?: string) => {
    return useFirestoreQuery<T>({
      collectionName: collectionName,
      documentId: id,
      key: [
        collectionName.endsWith("s")
          ? collectionName.slice(0, -1)
          : collectionName,
        id,
      ],
      enabled: !!id,
    });
  };
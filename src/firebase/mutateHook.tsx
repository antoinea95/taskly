import { useMutation, useQueryClient } from "@tanstack/react-query"
import FirestoreApi from "./FirestoreApi";


export const useAddDoc = <T, >(collectionName: string, subCollectionName?: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: {parentId?: string, document: T}): Promise<string> => FirestoreApi.createDocument<T>(collectionName, data.document, data.parentId, subCollectionName),
        onSuccess: (data, variables) => {
            if (variables.parentId && subCollectionName) {
              queryClient.invalidateQueries({queryKey: [`${collectionName}/${variables.parentId}/${subCollectionName}`]});
            } else {
              queryClient.invalidateQueries({queryKey: [collectionName]});
            }
          },
    });
};

export const useUpdateDoc = <T, >(collectionName: string, id: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: Partial<T>) => FirestoreApi.updateDocument<T>(collectionName, data, id),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: [collectionName, id]});
        }
    })
}

export const useDeleteDoc = (collectionName: string, id: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => FirestoreApi.deleteDocument(collectionName, id),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: [collectionName]});
        }
    })
}
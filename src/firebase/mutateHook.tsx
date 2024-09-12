import { InvalidateQueryFilters, useMutation, useQueryClient } from "@tanstack/react-query"
import FirestoreApi from "./FirestoreApi";


export const useAddDoc = <T, >(collectionName: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: T) => FirestoreApi.createDocument<T>(collectionName, data),
        onSuccess: () => {
            queryClient.invalidateQueries([collectionName] as InvalidateQueryFilters);
        }
    })
}

export const useUpdateDoc = <T, >(collectionName: string, id: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: Partial<T>) => FirestoreApi.updateDocument<T>(collectionName, data, id),
        onSuccess: () => {
            queryClient.invalidateQueries([collectionName] as InvalidateQueryFilters);
        }
    })
}

export const useDeleteDoc = (collectionName: string, id: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => FirestoreApi.deleteDocument(collectionName, id),
        onSuccess: () => {
            queryClient.invalidateQueries([collectionName] as InvalidateQueryFilters);
        }
    })
}
import { useMutation, useQueryClient } from "@tanstack/react-query"
import FirestoreApi from "./FirestoreApi";


export const useAddDoc = <T, >(queryName: string, databaseName: string, ) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data : T): Promise<string> => FirestoreApi.createDocument<T>(databaseName, data),
        onSuccess: () => {
              queryClient.invalidateQueries({queryKey: [queryName]});
          },
    });
};

export const useUpdateDoc = <T, >(queryName: string, databaseName: string, id: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data:Partial<T>) => FirestoreApi.updateDocument<T>(databaseName, data, id),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: [queryName]});
        }
    })
}

export const useDeleteDoc = (queryName: string, databaseName: string, id: string, subCollections?: string[]) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => FirestoreApi.deleteDocument(databaseName, id, subCollections),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: [queryName]});
        }
    })
}
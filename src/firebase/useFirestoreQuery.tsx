import {
    useQuery,
    useQueryClient,
    UseQueryOptions,
    UseQueryResult,
  } from "@tanstack/react-query";
  import { useEffect } from "react";
  import FirestoreApi from "./FirestoreApi";
  
  export const useFireStoreApi = <Data, >(
    path: string,
    documentId?: string,
    useQueryOptions?: UseQueryOptions<Data>
  ): UseQueryResult<Data> => {
    
    const queryClient = useQueryClient();


  
    useEffect(() => {
      const queryKey = documentId ? [path, documentId] : [path];
      const unsubscribe = FirestoreApi.subscribe<Data>({
        path: path,
        callback: (val: Data) => {
          queryClient.setQueryData(queryKey, val);
        },
      });
  
      return () => {
        unsubscribe(); 
      };
    }, [path, queryClient, documentId]);
  
    return useQuery<Data>({
      queryKey: documentId ? [path, documentId] : [path],
      queryFn: async (): Promise<Data> => {
        return FirestoreApi.fetch<Data>({path, documentId});
      },
      ...useQueryOptions
  });
  };
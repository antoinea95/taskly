import {
    useMutation,
    useQueryClient,
    MutationFunction,
  } from "@tanstack/react-query";
  import { MutationResultType } from "@/components/Form/form.types";


/**
 * Generic hook to execute a Firestore mutation using react-query.
 * Automatically invalidates specified queries after a successful mutation.
 * 
 * @template TData The type of data returned by the mutation.
 * @template TVariables The type of variables used by the mutation (defaults to `undefined`).
 * @template TError The type of errors returned by the mutation (defaults to `Error`).
 * @template TContext The type of context passed to the mutation (defaults to `unknown`).
 * 
 * @param mutationFn The mutation function provided to react-query, which performs the Firestore operation (e.g., add, update, delete).
 * @param key The key used by react-query to invalidate or update the cache after a successful mutation.
 * @param queryCollection Additional query collections to invalidate on successful mutation (optional).
 * @returns A `UseMutationResult` object from react-query that contains methods to execute the mutation and manage its state.
 */
export const useFirestoreMutation = <
  TData,
  TVariables = undefined,
  TError = Error,
  TContext = unknown,
>(
  mutationFn: MutationFunction<TData, TVariables>,
  key: any[],
  queryCollection?: string[]
): MutationResultType<TData, TError, TVariables, TContext> => {
  const queryClient = useQueryClient();

  return useMutation<TData, TError, TVariables, TContext>({
    mutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: key });
      if (queryCollection) {
        queryClient.invalidateQueries({ queryKey: queryCollection });
      }
    },
    onError: (error) => {
      console.error("Mutation error:", error);
      throw new Error("Error during mutation");
    },
  });
};


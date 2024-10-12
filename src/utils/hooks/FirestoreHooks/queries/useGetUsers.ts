import { useQuery } from "@tanstack/react-query";
import { FirestoreService } from "@/utils/firebase/firestore/firestoreService";
import { UserType } from "@/utils/types/auth.types";

/**
 * Custom hook to fetch users from the Firestore "users" collection.
 * 
 * @returns A React Query result object with the fetched user data.
 */
export const useGetUsers = () => {
  return useQuery({
    queryKey: ["users"], // Ajoute userId dans la clé de la requête pour éviter des doublons
    queryFn: () => {
      return FirestoreService.fetchDocs<UserType>("users");
    },
    staleTime: Infinity,
  });
};
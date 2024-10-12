import { AuthService } from "@/utils/firebase/auth/authService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

/**
 * Custom hook to handle user sign-out.
 * Uses `useMutation` from React Query to manage the sign-out process.
 *
 * @returns React Query's mutation result object containing `mutate` and other mutation states.
 */
export const useSignOut = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

  
    return useMutation({
      mutationFn: () => AuthService.signOut(),  // Call Firestore's sign-out method
      onSuccess: () => {
        navigate("/login");  // Navigate to the login page upon successful sign-out
        queryClient.invalidateQueries();
        queryClient.removeQueries();
      },
      onError: (error) => {
        console.error("Error while signing out", error);
      },
    });
  };
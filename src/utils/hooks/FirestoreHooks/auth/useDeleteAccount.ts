import { AuthService } from "@/utils/firebase/auth/authService";
import { useMutation } from "@tanstack/react-query";

/**
 * Custom hook to update a user's password.
 * It first reauthenticates the user using their current password, then updates the password.
 * @param userId - Id of the user to delete
 * @param  onSuccess - Callback function to execute on successful password update.
 * @returns  React Query mutation object for updating the password.
 */
export const useDeleteAccount = (userId: string, onSuccess: () => void) => {
  return useMutation({
    mutationFn: async () => {
        await AuthService.deleteAccount(userId)
    },
    onSuccess: () => {
      onSuccess();
    },
    onError: (error) => {
      console.error("Error deleting account:", error);
    },
  });
};

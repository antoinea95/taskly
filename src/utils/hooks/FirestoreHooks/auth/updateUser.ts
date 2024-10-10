import { AuthService } from "@/utils/firebase/auth/authService";
import { useMutation } from "@tanstack/react-query";

type UpdatePasswordData = {
  actualPassword: string;
  password: string;
  confirmPassword: string;
}

type UpdateEmailData = {
  userId: string;
  email: string;
}

/**
 * Custom hook to update a user's password.
 * It first reauthenticates the user using their current password, then updates the password.
 *
 * @param  onSuccess - Callback function to execute on successful password update.
 * @returns  React Query mutation object for updating the password.
 */
export const useUpdatePassword = (onSuccess: () => void) => {
  return useMutation<void, Error, UpdatePasswordData>({
    mutationFn: async ({ actualPassword, password }) => {
      await AuthService.updateUserPassword(actualPassword, password)
    },
    onSuccess: () => {
      onSuccess();
    },
    onError: (error) => {
      console.error("Error updating password:", error);
    },
  });
};


/**
 * Custom hook to update a user's email
 * @param  onSuccess - Callback function to execute on successful password update.
 * @returns  React Query mutation object for updating the email.
 */
export const useUpdateEmail = (onSuccess: () => void) => {
  return useMutation<void, Error, UpdateEmailData>({
    mutationFn: async ({ userId, email }) => {
      await AuthService.updateUserEmail(userId, email)
    },
    onSuccess: () => {
      onSuccess();
    },
    onError: (error) => {
      console.error("Error updating password:", error);
    },
  });
};


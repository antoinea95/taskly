import { AuthService } from "@/utils/firebase/auth/authService";
import { firebaseAuth } from "@/utils/firebase/firebaseApp";
import { useMutation } from "@tanstack/react-query";
import { sendPasswordResetEmail } from "firebase/auth";
import { FieldValues } from "react-hook-form";

export type UpdatePasswordData = {
  actualPassword: string;
  password: string;
  confirmPassword: string;
};

export type UpdateEmailData = {
  userId: string;
  email: string;
};

/**
 * Custom hook to update a user's password.
 * It first reauthenticates the user using their current password, then updates the password.
 *
 * @param  onSuccess - Callback function to execute on successful password update.
 * @returns  React Query mutation object for updating the password.
 */
export const useUpdatePassword = <T extends FieldValues>(
  onSuccess: () => void
) => {
  return useMutation<void, Error, T>({
    mutationFn: async ({ actualPassword, password }) => {
      await AuthService.updateUserPassword(actualPassword, password);
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
export const useUpdateEmail = <T extends FieldValues>(
  onSuccess: () => void
) => {
  return useMutation<void, Error, T>({
    mutationFn: async ({ userId, email }) => {
      await AuthService.updateUserEmail(userId, email);
    },
    onSuccess: () => {
      onSuccess();
    },
    onError: (error) => {
      console.error("Error updating password:", error);
    },
  });
};

export const useResetPassword = <T extends FieldValues>() => {
  return useMutation<void, Error, T>({
    mutationFn: async ({ email }) => {
      if (email) {
        try {
          await sendPasswordResetEmail(firebaseAuth, email);
        } catch (error) {
          console.error(error);
          throw new Error("Email does not exist");
        }
      } else {
        throw new Error("Please enter your email");
      }
    },
    onError: (error) => {
      console.error("Error reseting password:", error);
    },
  });
};

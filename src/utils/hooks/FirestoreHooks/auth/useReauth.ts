import { AuthService } from "@/utils/firebase/auth/authService";
import { firebaseAuth } from "@/utils/firebase/firebaseApp";
import { useMutation } from "@tanstack/react-query";
import { GoogleAuthProvider, reauthenticateWithPopup } from "firebase/auth";
import { FieldValues } from "react-hook-form";

export const useReauthWithPassword = <T extends FieldValues>(
  onSuccess: () => void
) => {
  return useMutation<void, Error, T>({
    mutationFn: async ({ password }) => {
      try {
        await AuthService.reauthenticateUser(password);
      } catch (error) {
        console.error(error);
        throw new Error("error");
      }
    },
    onSuccess: () => onSuccess(),
  });
};

export const useReauthWithGoogle = (onSuccess: () => void) => {
  return useMutation({
    mutationFn: async () => {
      try {
        const provider = new GoogleAuthProvider();
        await reauthenticateWithPopup(firebaseAuth.currentUser!, provider);
      } catch (error) {
        console.error(error);
        throw new Error("error");
      }
    },
    onSuccess: () => onSuccess(),
  });
};

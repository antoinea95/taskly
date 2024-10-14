import { AuthService } from "@/utils/firebase/auth/authService";
import { firebaseAuth } from "@/utils/firebase/firebaseApp";
import { useMutation } from "@tanstack/react-query";
import { GoogleAuthProvider, reauthenticateWithPopup } from "firebase/auth";
import { FieldValues } from "react-hook-form";

export const useReauthWithPassword = <T extends FieldValues>(
  onSuccess: () => void
) => {
  return useMutation<void, Error, T>({
    mutationFn: async (data) => {
      try {
        await AuthService.reauthenticateUser({password: data.password});
      } catch (error) {
        console.error(error);
        throw new Error("You password is wrong, please retry");
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
      } catch (error:any) {
        console.error(error);
        if(error.code === "auth/user-mismatch") {
          throw new Error("Unknown google account, please retry with another one")
        } else {
          throw new Error("Error while logging with google");
        }
      }
    },
    onSuccess: () => onSuccess(),
  });
};

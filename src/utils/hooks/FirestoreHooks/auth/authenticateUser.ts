import { AuthService } from "@/utils/firebase/auth/authService";
import { SignInData } from "../../hooks.types";

/**
 * Utility function to handle user authentication.
 * It calls either `signUp` or `signIn` method from FirestoreApi.
 *
 * @param  data - The sign-in or sign-up data.
 * @returns  Returns a promise that resolves when authentication is successful.
 */
export const authenticateUser = async ({ email, password, name }: SignInData) => {
    if (name) {
      return AuthService.signUp(email, password, name);  // Sign up if name is provided
    } else {
      return AuthService.signIn(email, password);  // Sign in if no name is provided
    }
  };
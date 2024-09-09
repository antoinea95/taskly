import { create } from "zustand";
import {
  User as FirebaseUser,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth"; // Assurez-vous d'importer createUserWithEmailAndPassword
import { auth } from "../firebase/firebase";
import { StatusType, ErrorType } from "../utils/types";
import { getFriendlyErrorMessage } from "@/utils/error";

type AuthState = {
  user: FirebaseUser | null;
  status: StatusType;
  error: ErrorType;
};

type AuthAction = {
  createUser: (email: string, password: string, name: string) => void;
  logIn: (email: string, password: string) => void;
  logOut: () => void;
};

export const useAuthStore = create<AuthState & AuthAction>((set) => ({
  user: auth.currentUser,
  status: null,
  error: null,

  createUser: (email: string, password: string, name: string) => {
    set((state) => ({ ...state, status: "loading", error: null }));

    console.log(email, name, password);

    // Création de l'utilisateur avec email et mot de passe
    createUserWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        const user = userCredential.user;

        return updateProfile(user, {
          displayName: name,
        }).then(() => {
          set({
            user: user,
            status: "success",
            error: null,
          });
        });
      })
      .catch((err: any) => {
        const friendlyMessage = getFriendlyErrorMessage(err.code);
        set((state) => ({ ...state, status: "error", error: friendlyMessage }));
      });
  },

  logIn: (email: string, password: string) => {
    set((state) => ({ ...state, status: "loading", error: null }));

    signInWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        const user = userCredential.user;
        set({
          user: user,
          status: "success",
          error: null,
        });
      })
      .catch((err: any) => {
        console.log(err.code);
        const friendlyMessage = getFriendlyErrorMessage(err.code);
        set((state) => ({ ...state, status: "error", error: friendlyMessage }));
      });
  },

  logOut: () => {
    set((state) => ({ ...state, status: "loading", error: null }));
    signOut(auth)
      .then(() => {
        set({
          user: null,
          status: null,
          error: null,
        });
      })
      .catch((err: any) => {
        const friendlyMessage = getFriendlyErrorMessage(err.code);
        set((state) => ({ ...state, status: "error", error: friendlyMessage }));
      });
  },
}));

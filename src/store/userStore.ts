import { create } from "zustand";
import {
  User as FirebaseUser,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth"; // Assurez-vous d'importer createUserWithEmailAndPassword
import { auth } from "../firebase/firebase";

type UserState = {
  user: FirebaseUser | null;
  status: "success" | "loading" | "error" | null;
  error: string | null;
};

type UserAction = {
  createUser: (email: string, password: string, name: string) => void;
  logInUser: (email: string, password: string) => void;
  logOutUser: () => void;
};

export const useUserStore = create<UserState & UserAction>((set) => ({
  user: auth.currentUser,
  status: null,
  error: null,

  createUser: (email: string, password: string, name: string) => {
    set({ status: "loading", error: null });

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
      .catch((error) => {
        set({
          user: null,
          status: "error",
          error: error.message,
        });
      });
  },

  logInUser: (email: string, password: string) => {
    set({ status: "loading", error: null });

    signInWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        const user = userCredential.user;
        set({
          user: user,
          status: "success",
          error: null,
        });
      })
      .catch((error) => {
        set({
          user: null,
          status: "error",
          error: error.message,
        });
      });
  },

  logOutUser: () => {
    signOut(auth)
      .then(() => {
        set({
          user: null,
          status: null,
          error: null,
        });
      })
      .catch((error) => {
        set({
          status: "error",
          error: error.message,
        });
      });
  },

}));

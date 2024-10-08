import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import FirestoreApi from "./FirestoreApi";
import { User } from "firebase/auth";
import { UserType } from "@/utils/types";

interface SignInData {
  email: string;
  password: string;
  name?: string;
}

const authenticateUser = async ({ email, password, name }: SignInData) => {
  if (name) {
    return FirestoreApi.signUp(email, password, name);
  } else {
    return FirestoreApi.signIn(email, password);
  }
};

export const useSign = () => {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: authenticateUser,
    onSuccess: () => {
      navigate("/");
    },
    onError: (error) => {
      console.error("Authentication error:", error);
    },
  });
};

export const useSignOut = () => {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: () => FirestoreApi.signOut(),
    onSuccess: () => {
      navigate("/login");
    },
    onError: (error) => {
      console.error("Sign out error:", error);
    },
  });
};

export const useAuth = () => {
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fonction pour souscrire aux changements de l'utilisateur authentifié
    const unsubscribeAuth = FirestoreApi.getAuthInstance().onAuthStateChanged(
      async (user: User | null) => {
        if (user) {
          const unsubscribeUserData = FirestoreApi.subscribeToDocument<UserType>({
            collectionName: "users",
            documentId: user.uid,
            callback: (fireStoreUser) => {
              setCurrentUser(fireStoreUser);
              setIsLoading(false);
            },
            errorMessage: "Erreur lors de la récupération des données utilisateur.",
          });
          return () => {
            unsubscribeUserData();
          };
        } else {
          setCurrentUser(null);
          setIsLoading(false);
        }
      }
    );
    return () => {
      unsubscribeAuth();
    };
  }, []);

  return { currentUser, isLoading };
};

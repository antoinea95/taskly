import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { User } from "firebase/auth";
import FirestoreApi from "./FirestoreApi";


export const useSignIn = () => {
    return useMutation({
       mutationFn: ({email, password} : {email: string, password: string}) => FirestoreApi.signIn(email, password),
       onSuccess: (user) => {
        console.log("User signed in:", user);
      },
      onError: (error) => {
        console.error("Sign in error:", error);
      },
    })
}

export const useSignUp = () => {
    return useMutation({
       mutationFn: ({email, password, name} : {email: string, password: string, name: string}) => FirestoreApi.signUp(email, password, name),
       onSuccess: (user) => {
        console.log("User created:", user);
      },
      onError: (error) => {
        console.error("Sign up error:", error);
      },
    })
}

export const useSignOut = () => {
    return useMutation({
        mutationFn: () => FirestoreApi.signOut(),
        onSuccess: () => {
          console.log("User signed out");
        },
        onError: (error) => {
          console.error("Sign out error:", error);
        },
      });
}


export const useAuth = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(
    FirestoreApi.getCurrentUser()
  );

  useEffect(() => {
    const unsubscribe = FirestoreApi.getAuthInstance().onAuthStateChanged(
      (user: User | null) => {
        setCurrentUser(user);
      }
    );

    return () => unsubscribe();
  }, []);


  return {
    currentUser,
  };
};

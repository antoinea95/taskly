import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { User } from "firebase/auth";
import FirestoreApi from "./FirestoreApi";
import {useNavigate } from "react-router-dom";


export const useSignIn = () => {
    const navigate = useNavigate();
    return useMutation({
       mutationFn: ({email, password} : {email: string, password: string}) => FirestoreApi.signIn(email, password),
       onSuccess: () => {
        navigate("/");
      },
      onError: (error) => {
        console.error("Sign in error:", error);
      },
    })
}

export const useSignUp = () => {
  const navigate = useNavigate();
    return useMutation({
       mutationFn: ({email, password, name} : {email: string, password: string, name: string}) => FirestoreApi.signUp(email, password, name),
       onSuccess: () => {
        navigate("/");
      },
      onError: (error) => {
        console.error("Sign up error:", error);
      },
    })
}

export const useSignOut = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => FirestoreApi.signOut(),
        onSuccess: () => {
          queryClient.invalidateQueries();
          navigate("/login");
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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = FirestoreApi.getAuthInstance().onAuthStateChanged(
      (user: User | null) => {
        setCurrentUser(user);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);


  return {currentUser, isLoading};
};

import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { User } from "firebase/auth";
import FirestoreApi from "./FirestoreApi";
import { useNavigate } from "react-router-dom";

export const useSign = () => {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: ({
      email,
      password,
      name,
    }: {
      email: string;
      password: string;
      name?: string;
    }) => {
      if (!name) {
        return FirestoreApi.signIn(email, password);
      } else {
        return FirestoreApi.signUp(email, password, name);
      }
    },
    onSuccess: () => {
      navigate("/");
    },
    onError: (error) => {
      console.error("Sign in error:", error);
    },
  });
};

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

  return { currentUser, isLoading };
};

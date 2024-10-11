import { firebaseAuth } from "@/utils/firebase/firebaseApp";
import { FirestoreService } from "@/utils/firebase/firestore/firestoreService";
import { UserType } from "@/components/types/auth.types";
import { User } from "firebase/auth";
import { useCallback, useEffect, useState } from "react";

/**
 * Custom hook to handle user authentication state.
 * Listens for changes in authentication state and fetches user data accordingly.
 * Uses Firestore's `onAuthStateChanged` to subscribe to the authentication state.
 *
 * @returns Returns an object with the current user, loading state, and any authentication errors.
 * @returns currentUser - The current authenticated user or null if not authenticated.
 * @returns isLoading - Loading state that indicates whether the user data is being fetched.
 * @returns error - Any error message that occurred during the authentication or user data retrieval.
 */
export const useAuth = () => {
    const [currentUser, setCurrentUser] = useState<UserType | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
  
    /**
     * Subscribes to the user data from Firestore using the provided user.
     * Fetches user data from Firestore and updates the state accordingly.
     *
     * @param {User | null} user - The authenticated Firebase user or null if not authenticated.
     * @returns {Function} - Returns a cleanup function to unsubscribe from the user data when the component unmounts.
     */
    const subscribeToUser = useCallback((user: User | null) => {
      if (user) {
        const unsubscribeUserData = FirestoreService.subscribeToDocument<UserType>(
           "users",
          user.uid,
          (fireStoreUser) => {
            setCurrentUser(fireStoreUser);
            setIsLoading(false);  // Set loading to false when user data is fetched
          },
            "Error retrieving user data.",  // Provide a custom error message
        );
        return () => {
          unsubscribeUserData();  // Return the cleanup function to unsubscribe
        };
      } else {
        setCurrentUser(null);
        setIsLoading(false);  // Set loading to false when user is not authenticated
      }
    }, []);
  
    useEffect(() => {
      // Subscribes to authentication state changes and updates the current user accordingly
      const unsubscribeAuth = firebaseAuth.onAuthStateChanged(
        async (user: User | null) => {
          try {
            unsubscribeAuth();  // Unsubscribe when the component unmounts or when state changes
            const unsubscribeUserData = subscribeToUser(user);  // Subscribe to user data
            return unsubscribeUserData;  // Return the unsubscribe function
          } catch (err) {
            setError("Authentication error.");  // Set an error state if an exception occurs
            setIsLoading(false);  // Set loading to false on error
            console.error("Error during auth state change", err);  // Log the error
          }
        }
      );
  
      return () => {
        unsubscribeAuth();  // Cleanup subscription on component unmount
      };
    }, [subscribeToUser]);
  
    return { currentUser, isLoading, error };
  };
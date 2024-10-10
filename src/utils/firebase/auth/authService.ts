import {
  Auth,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateEmail,
  updatePassword,
  updateProfile,
  User,
} from "firebase/auth";
import { firebaseAuth, firebaseFirestore } from "../firebaseApp";
import { getFriendlyErrorMessage } from "@/firebase/formatErrors";
import { doc, Firestore, setDoc, where } from "firebase/firestore";
import { FirestoreService } from "../firestore/firestoreService";
import { BoardType, UserType } from "@/utils/types";
import { BatchService } from "../firestore/batchService";
import { reauthenticateUser } from "@/components/Auth/ReauthUser";

const googleProvider = new GoogleAuthProvider();

export class AuthService {
  private static firebaseAuth: Auth = firebaseAuth;
  private static firebaseFirestore: Firestore = firebaseFirestore;

  /**
   * Adds a user to Firestore after sign-up.
   * @param user - The Firebase User object.
   * @returns A promise that resolves when the user is added to Firestore.
   * @throws  Throws an error if the user cannot be added to Firestore.
   */
  private static async addUserToFirestore(user: User): Promise<void> {
    const docRef = doc(this.firebaseFirestore, "users", user.uid);
    const displayName =
      user.displayName ||
      (user.email ? user.email.split("@")[0] : "Unknown user");

    try {
      await setDoc(
        docRef,
        {
          email: user.email || null,
          name: displayName,
          photoURL: user.photoURL || null,
        },
        { merge: true }
      );
    } catch (error) {
      console.error("Error adding user to Firestore:", error);
      throw new Error("Failed to add user to Firestore");
    }
  }

  /**
   * Signs up a new user with email and password.
   * @param email - The email of the new user.
   * @param password- The password for the new user.
   * @param name - The name of the new user.
   * @returns The Firebase User object.
   * @throws Throws an error if sign-up fails.
   */
  public static async signUp(
    email: string,
    password: string,
    name: string
  ): Promise<User> {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        this.firebaseAuth,
        email,
        password
      );
      const user = userCredential.user;

      await updateProfile(user, { displayName: name });
      await this.addUserToFirestore(user);
      return user;
    } catch (error: any) {
      console.error("Error during sign-up:", error);
      const friendlyError = getFriendlyErrorMessage(error.code);
      throw new Error(friendlyError);
    }
  }

  /**
   * Signs in a user with email and password.
   * @param email - The email of the user.
   * @param password - The password of the user.
   * @returns The Firebase User object.
   * @throws Throws an error if sign-in fails.
   */
  public static async signIn(email: string, password: string): Promise<User> {
    try {
      const useCredential = await signInWithEmailAndPassword(
        this.firebaseAuth,
        email,
        password
      );
      return useCredential.user;
    } catch (error: any) {
      const friendlyError = getFriendlyErrorMessage(error.code);
      throw new Error(friendlyError);
    }
  }

  /**
   * Signs in a user using Google authentication.
   * @returns The Firebase User object.
   * @throws Throws an error if Google sign-in fails.
   */
  public static async signInWithGoogle(): Promise<User> {
    try {
      const userCredential = await signInWithPopup(
        this.firebaseAuth,
        googleProvider
      );

      const user = userCredential.user;

      const existingUser = await FirestoreService.fetchDoc("users", user.uid);

      if (!existingUser) {
        await this.addUserToFirestore(user);
      }

      return user;
    } catch (error: any) {
      console.error("Error during Google sign-in:", error);
      const friendlyError = getFriendlyErrorMessage(error.code);
      throw new Error(friendlyError);
    }
  }

  /**
   * Signs out the current authenticated user.
   * @returns A promise that resolves when the user is signed out.
   * @throws Throws an error if sign-out fails.
   */
  public static async signOut(): Promise<void> {
    try {
      await signOut(this.firebaseAuth);
    } catch (error: any) {
      const friendlyError = getFriendlyErrorMessage(error.code);
      throw new Error(friendlyError);
    }
  }

  /**
   * Retrieves the current authenticated user.
   * @returns The current user object or null if no user is authenticated.
   */
  public static getCurrentUser(): User | null {
    const user = this.firebaseAuth.currentUser;
    if (user) {
      return user;
    } else {
      return null;
    }
  }

  /**
   * Update user password in Firebase authentification
   * @param userId - Id of the user to update
   * @param actualPassword - actual password
   * @param newPassword - new password
   * @returns A promise that resolves when the user's password is updated
   * @throws an error message if any operation fails during updating.

   */
  public static async updateUserPassword(actualPassword: string, newPassword: string): Promise<void> {
    const user = firebaseAuth.currentUser;

    // Check if the user is authenticated
    if (!user) {
      console.error("User not authenticated.");
      return;
    }

    try {
      // First we reauthenticate the user
      await reauthenticateUser(actualPassword);
      // Then we update his password
      await updatePassword(user, newPassword);
    } catch(error) {
      console.error("Error updating user password",error);
      throw new Error("Error updating user password")
    }
  }


  /**
   * Update user email in Firebase authentification and update user document in firestore
   * @param userId - Id of the user to update
   * @param email - new email
   * @returns A promise that resolves when the user's email is updated
   * @throws an error message if any operation fails during updating.

   */
  public static async updateUserEmail(userId: string, email: string): Promise<void> {
    const user = firebaseAuth.currentUser;

    // Check if the user is authenticated
    if (!user) {
      console.error("User not authenticated.");
      return;
    }

    try {
      await updateEmail(user, email);
       await FirestoreService.updateDocument<UserType>("users", {
        email: email
       }, userId);
    } catch(error) {
      console.error("Error updating user email",error);
      throw new Error("Error updating user email")
    }
  }
  /**
   * Deletes a user account along with their related data in Firestore and Firebase Authentication.
   *
   * This function performs the following steps:
   * 1. Fetches the boards where the user is either a member or the creator.
   * 2. If the user is the creator of a board, the entire board is deleted.
   * 3. If the user is only a member, they are removed from the board's members list.
   * 4. The user's document in the "users" collection is deleted from Firestore.
   * 5. The user's Firebase Authentication account is deleted.
   *
   * @param   userId - The unique ID of the user to be deleted.
   * @returns A promise that resolves once the user and associated data are deleted.
   * @throws an error message if any operation fails during the deletion process.
   */
  public static async deleteAccount(userId: string): Promise<void> {
    const user = firebaseAuth.currentUser;

    // Check if the user is authenticated
    if (!user) {
      console.error("User not authenticated.");
      return;
    }

    try {
      // Fetch the boards where the user is a member or creator
      const boards = await FirestoreService.fetchDocs<BoardType>(
        "boards",
        () => [where("members", "array-contains", userId)]
      );

      // Handle deletion or update of boards
      if (boards?.length) {
        await Promise.all(
          boards.map(async (board) => {
            if (board.creator === userId) {
              // If the user is the creator, delete the entire board
              await BatchService.deleteBoard(board.id);
            } else {
              // If the user is a member, remove them from the members list
              const updatedMembers = board.members.filter(
                (member) => member !== userId
              );
              await FirestoreService.updateDocument<BoardType>(
                "boards",
                { members: updatedMembers },
                board.id
              );
            }
          })
        );
      }

      // Delete user data from Firestore
      await FirestoreService.deleteDocument("users", userId);

      // Delete the user from Firebase Authentication
      await user.delete();
    } catch (error) {
      console.error("Error deleting account:", error);
      throw new Error("Error during deleting account")
    }
  }
}

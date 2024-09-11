import { getFriendlyErrorMessage } from "@/utils/error";
import { FirebaseApp, FirebaseError, initializeApp } from "firebase/app";
import {
  Auth,
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  User,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  getDoc,
  onSnapshot,
  Firestore,
  DocumentReference,
  CollectionReference,
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

export interface FirestoreFetchParams {
  path: string;
  documentId?: string;
}

export interface FirestoreSubscribeParams<T> {
  path: string;
  callback: (value: T) => void;
  documentId?: string;
}

export class FirestoreApi {
  private firebaseApp: FirebaseApp;
  private firebaseAuth: Auth;
  private firebaseFirestore: Firestore;

  constructor() {
    this.firebaseApp = initializeApp({
      apiKey: `${import.meta.env.VITE_FIREBASE_WEB_API_KEY}`,
      authDomain: `${import.meta.env.VITE_FIREBASE_AUTH_DOMAIN}`,
      projectId: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}`,
      storageBucket: `${import.meta.env.VITE_FIREBASE_STORAGE_BUCKET}`,
      messagingSenderId: `${import.meta.env.VITE_FIREBASE_SENDER_ID}`,
      appId: `${import.meta.env.VITE_FIREBASE_WEB_APP_ID}`,
    });

    this.firebaseAuth = getAuth(this.firebaseApp);
    this.firebaseFirestore = getFirestore(this.firebaseApp);
  }

  private handleAuthErrors(error: Error) {
    if ((error as FirebaseError).code === "PERMISSION_DENIED") {
      console.log("Permission denied:", error);
    } else {
      console.error("Unexpected error:", error);
    }
  }

  public getAuthInstance() {
    return this.firebaseAuth;
  }

  public async createDocument<T>(
    collectionName: string,
    data: Omit<T, "id">
  ): Promise<void> {
    try {
      const docRef = collection(this.firebaseFirestore, collectionName);
      await addDoc(docRef, data);
    } catch (error) {
      console.error("Error creating document:", error);
      throw new Error("Failed to create document");
    }
  }

  public async updateDocument<T>(
    collectionName: string,
    data: Partial<T>,
    id: string
  ): Promise<void> {
    try {
      const docRef = doc(this.firebaseFirestore, collectionName, id);
      await updateDoc(docRef, data);
    } catch (error) {
      console.error("Error updating document:", error);
      throw new Error("Failed to update document");
    }
  }

  public async deleteDocument(
    collectionName: string,
    id: string
  ): Promise<void> {
    try {
      const docRef = doc(this.firebaseFirestore, collectionName, id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error("Error deleting document:", error);
      throw new Error("Failed to delete document");
    }
  }

  public async signUp(
    email: string,
    password: string,
    name: string
  ): Promise<User> {
    try {
      const useCredential = await createUserWithEmailAndPassword(
        this.firebaseAuth,
        email,
        password
      );
      const user = useCredential.user;
      await updateProfile(user, {
        displayName: name,
      });
      return user;
    } catch (error: any) {
      console.log(error);
      const friendlyError = getFriendlyErrorMessage(error.code);
      throw new Error(friendlyError);
    }
  }

  public async signIn(email: string, password: string): Promise<User> {
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

  public async signOut(): Promise<void> {
    try {
      await signOut(this.firebaseAuth);
    } catch (error: any) {
      const friendlyError = getFriendlyErrorMessage(error.code);
      throw new Error(friendlyError);
    }
  }

  public getCurrentUser(): User | null {
    const user = this.firebaseAuth.currentUser;
    if (user) {
      return user;
    } else {
      return null;
    }
  }

  public async fetch<T>({
    path,
    documentId,
  }: FirestoreFetchParams): Promise<T> {
    try {
      if (documentId) {
        const docRef = doc(this.firebaseFirestore, path, documentId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          return docSnap.data() as T;
        } else {
          throw new Error("No document found");
        }
      } else {
        const colRef = collection(this.firebaseFirestore, path);
        const querySnapshot = await getDocs(colRef);
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as T),
        }));
        return data as T;
      }
    } catch (error) {
      console.error("Error fetching document or collection:", error);
      throw new Error("Failed to fetch data");
    }
  }

  public subscribe<T>(params: FirestoreSubscribeParams<T>) {
    const { path, callback, documentId } = params;

    if (documentId) {
      // Si c'est un document
      const docRef: DocumentReference = doc(
        this.firebaseFirestore,
        path,
        documentId
      );
      return onSnapshot(
        docRef,
        (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data() as T;
            callback(data);
          }
        },
        (error) => this.handleAuthErrors(error)
      );
    } else {
      // Si c'est une collection
      const colRef: CollectionReference = collection(
        this.firebaseFirestore,
        path
      );
      return onSnapshot(
        colRef,
        (querySnapshot) => {
          const data = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          callback(data as T);
        },
        (error) => this.handleAuthErrors(error)
      );
    }
  }
}

export default new FirestoreApi();

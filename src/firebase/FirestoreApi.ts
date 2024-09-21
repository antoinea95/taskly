import { getFriendlyErrorMessage } from "@/utils/error";
import { FirebaseApp, initializeApp } from "firebase/app";
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
  Firestore,
  CollectionReference,
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  QuerySnapshot,
  doc,
  getDoc,
} from "firebase/firestore";

const app = initializeApp({
  apiKey: `${import.meta.env.VITE_FIREBASE_WEB_API_KEY}`,
  authDomain: `${import.meta.env.VITE_FIREBASE_AUTH_DOMAIN}`,
  projectId: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}`,
  storageBucket: `${import.meta.env.VITE_FIREBASE_STORAGE_BUCKET}`,
  messagingSenderId: `${import.meta.env.VITE_FIREBASE_SENDER_ID}`,
  appId: `${import.meta.env.VITE_FIREBASE_WEB_APP_ID}`,
});

export class FirestoreApi {
  private firebaseApp: FirebaseApp;
  private firebaseAuth: Auth;
  private firebaseFirestore: Firestore;

  constructor() {
    this.firebaseApp = app;
    this.firebaseAuth = getAuth(this.firebaseApp);
    this.firebaseFirestore = getFirestore(this.firebaseApp);
  }

  public getAuthInstance() {
    return this.firebaseAuth;
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

  public async createDocument<T>(
    collectionName: string,
    data: Omit<T, "id">
  ): Promise<string> {
    try {
      const docRef = collection(this.firebaseFirestore, collectionName);

      const snapShotRef = await addDoc(docRef, data);
      return snapShotRef.id;
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
    } catch (error: any) {
      console.error("Error updating document:", error);
      if (error.code === 'not-found') {
        throw new Error(`Document with id ${id} not found`);
      } else {
        throw new Error("Failed to update document");
      }
    }
  }

  public async deleteDocument(
    collectionName: string,
    id: string
  ): Promise<void> {
    try {
      const docRef = doc(this.firebaseFirestore, collectionName, id);
      await deleteDoc(docRef);
    } catch (error: any) {
      console.error("Error deleting document:", error);
      if (error.code === 'not-found') {
        throw new Error(`Document with id ${id} not found`);
      } else {
        throw new Error("Failed to delete document");
      }
    }
  }

  public async fetchDoc<T>({
    collectionName,
    documentId,
  }: {collectionName: string, documentId: string}): Promise<T> {
    try {
      const docRef = doc(this.firebaseFirestore, collectionName, documentId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return docSnap.data() as T;
      } else {
        throw new Error("No document found");
      }
    } catch (error) {
      console.error("Error fetching document", error);
      throw new Error("Failed to fetch data");
    }
  }

  public subscribeToDocument<T>({
    collectionName,
    documentId,
    callback,
    errorMessage,
  }: {
    collectionName: string;
    documentId: string;
    callback: (data: T | null) => void;
    errorMessage: string;
  }): () => void {
    const docRef = doc(this.firebaseFirestore, collectionName, documentId);
  
    const unsubscribe = onSnapshot(
      docRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const doc = {
            ...docSnap.data(),
            id: docSnap.id
          }
          callback(doc as T);
        } else {
          callback(null);
        }
      },
      (error) => {
        console.error(`${errorMessage}`, error);
        callback(null);
      }
    );
  
    return unsubscribe;
  }
  
  public subscribeToCollection<T>({
    collectionName,
    queryFn,
    callback,
    errorMessage,
  }: {
    collectionName: string;
    queryFn?: (colRef: CollectionReference) => any;
    callback: (data: T[]) => void;
    errorMessage: string;
  }): () => void {
    const colRef = collection(this.firebaseFirestore, collectionName);
    const q = queryFn ? queryFn(colRef) : colRef;
  
    const unsubscribe = onSnapshot(
      q,
      (querySnapshot: QuerySnapshot) => {
        const docs = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        })) as T[];
        callback(docs);
      },
      (error) => {
        console.error(`${errorMessage}`, error);
        callback([]);
      }
    );
  
    return unsubscribe;
  }
}

export default new FirestoreApi();

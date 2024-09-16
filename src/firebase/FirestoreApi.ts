import { getFriendlyErrorMessage } from "@/utils/error";
import { BoardType, ListType, TaskType } from "@/utils/types";
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
  query,
  where,
  QuerySnapshot,
} from "firebase/firestore";

const app = initializeApp({
  apiKey: `${import.meta.env.VITE_FIREBASE_WEB_API_KEY}`,
  authDomain: `${import.meta.env.VITE_FIREBASE_AUTH_DOMAIN}`,
  projectId: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}`,
  storageBucket: `${import.meta.env.VITE_FIREBASE_STORAGE_BUCKET}`,
  messagingSenderId: `${import.meta.env.VITE_FIREBASE_SENDER_ID}`,
  appId: `${import.meta.env.VITE_FIREBASE_WEB_APP_ID}`,
});

export interface FirestoreFetchColParams {
  collectionName: string;
  field: string;
  value: string;
  errorMessage: string;
}

export interface FirestoreFetchDocParams {
  databaseName: string;
  documentId: string;
}

interface SubscribeParams<T> {
  databaseName: string;
  queryFn?: (colRef: CollectionReference) => any;
  documentId?: string;
  callback: (data: T[]) => void;
}

export class FirestoreApi {
  private firebaseApp: FirebaseApp;
  private firebaseAuth: Auth;
  private firebaseFirestore: Firestore;

  constructor() {
    this.firebaseApp = app;

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
    data: Omit<T, "id">,    
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
    } catch (error) {
      console.error("Error updating document:", error);
      throw new Error("Failed to update document");
    }
  }

  private async deleteSubcollections(docRef: DocumentReference, subCollections: string[]): Promise<void> {
    if (subCollections.length === 0) return;

    const currentLevel = subCollections[0];
    const subCollectionRef = collection(docRef, currentLevel);
    const subCollectionDocs = await getDocs(subCollectionRef);

    for (const subDoc of subCollectionDocs.docs) {
      await this.deleteSubcollections(subDoc.ref, subCollections.slice(1));
      await deleteDoc(subDoc.ref);
    }
  }

  public async deleteDocument(
    databaseName: string,
    id: string,
    subCollections?: string[], 
  ): Promise<void> {
    try {
      const docRef = doc(this.firebaseFirestore, databaseName, id);

      if (subCollections && subCollections.length > 0) {
        await this.deleteSubcollections(docRef, subCollections);
      }
     
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

  public async fetchBoards(): Promise<BoardType[]> {
    try {
      const currentUser = this.getCurrentUser();

      if (!currentUser || !currentUser.uid) {
        // Lancer une erreur si l'utilisateur n'est pas défini ou si l'ID utilisateur est manquant
        throw new Error("No user found or user ID is missing");
      }

        const colRef = collection(this.firebaseFirestore, "boards");
        const q = query(colRef, where("members", "array-contains", currentUser.uid));
        const querySnapshot = await getDocs(q);
  
        const boards = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        })) as BoardType[];
  
        return boards;

    } catch (error) {
      console.error("Error fetching user boards", error);
      throw new Error("Failed to fetch boards");
    }
  }

  private async fetchCollections<T>({
    databaseName,
    errorMessage,
  } : {databaseName: string, errorMessage: string}): Promise<T[]> {
    try {
      const colRef = collection(this.firebaseFirestore, databaseName);
      const querySnapshot = await getDocs(colRef);

      return querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      })) as T[];
    } catch (error) {
      console.error(`${errorMessage}`, error);
      throw new Error(errorMessage);
    }
  }

  public async fetchLists(boardId: string): Promise<ListType[]> {
    return this.fetchCollections<ListType>({
      databaseName: `boards/${boardId}/lists`,
      errorMessage: "Error fetching lists",
    });
  }

  public async fetchTasks(boardId: string, listId: string): Promise<TaskType[]> {
    return this.fetchCollections<TaskType>({
      databaseName: `boards/${boardId}/lists/${listId}/tasks`,
      errorMessage: "Error fetching tasks",
    });
  }

  public async fetchDoc<T>({
    databaseName,
    documentId,
  }: FirestoreFetchDocParams): Promise<T> {
    try {
      const docRef = doc(this.firebaseFirestore, databaseName, documentId);
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

  public subscribe<T>({
    databaseName,
    queryFn,
    documentId,
    callback,
  }: SubscribeParams<T>): () => void {
    if (documentId) {
      const docRef: DocumentReference = doc(this.firebaseFirestore, databaseName, documentId);
      return onSnapshot(docRef, (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data() as T;
          callback([data]);
        }
      }, (error) => this.handleAuthErrors(error));
    } else {
      const colRef: CollectionReference = collection(this.firebaseFirestore, databaseName);
      const q = queryFn ? queryFn(colRef) : colRef;
      return onSnapshot(q, (querySnapshot: QuerySnapshot<T>) => {
        const newData = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        })) as T[];
  
        // Comparer les données avant de mettre à jour le cache
        const existingData = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        })) as T[];
  
        if (JSON.stringify(newData) !== JSON.stringify(existingData)) {
          callback(newData);
        }
      }, (error) => this.handleAuthErrors(error));
    }
  }
}

export default new FirestoreApi();

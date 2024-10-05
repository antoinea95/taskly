import { getFriendlyErrorMessage } from "@/utils/error";
import { FirebaseApp, initializeApp } from "firebase/app";
import {
  Auth,
  createUserWithEmailAndPassword,
  getAuth,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
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
  onSnapshot,
  QuerySnapshot,
  doc,
  getDoc,
  setDoc,
  writeBatch,
  getDocs,
  DocumentReference,
  WriteBatch,
  query,
  where,
} from "firebase/firestore";

const app = initializeApp({
  apiKey: `${import.meta.env.VITE_FIREBASE_WEB_API_KEY}`,
  authDomain: `${import.meta.env.VITE_FIREBASE_DATABASE_URL}`,
  projectId: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}`,
  storageBucket: `${import.meta.env.VITE_FIREBASE_STORAGE_BUCKET}`,
  messagingSenderId: `${import.meta.env.VITE_FIREBASE_SENDER_ID}`,
  appId: `${import.meta.env.VITE_FIREBASE_WEB_APP_ID}`,
});

const googleProvider = new GoogleAuthProvider();

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

  private async addUserToFirestore(user: User): Promise<void> {
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

  public async signUp(
    email: string,
    password: string,
    name: string
  ): Promise<User> {
    try {
      // Création du compte avec email et mot de passe
      const userCredential = await createUserWithEmailAndPassword(
        this.firebaseAuth,
        email,
        password
      );
      const user = userCredential.user;

      // Mise à jour du profil utilisateur avec le nom fourni
      await updateProfile(user, { displayName: name });

      // Ajouter l'utilisateur dans Firestore
      await this.addUserToFirestore(user);

      return user;
    } catch (error: any) {
      console.error("Error during sign-up:", error);
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

  public async signInWithGoogle(): Promise<User> {
    try {
      // Authentification via Google
      const userCredential = await signInWithPopup(
        this.firebaseAuth,
        googleProvider
      );
      const user = userCredential.user;

      const existingUser = await this.fetchDoc({
        collectionName: "users",
        documentId: user.uid,
      });

      console.log(existingUser);

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
      if (error.code === "not-found") {
        throw new Error(`Document with id ${id} not found`);
      } else {
        throw new Error("Failed to update document");
      }
    }
  }

  public async deleteBoard(boardId: string): Promise<void> {
    try {
      const batch = writeBatch(this.firebaseFirestore);
      const boardRef = doc(this.firebaseFirestore, "boards", boardId);

      // Étape 1: Récupérer les listes associées au board
      const listsCollectionRef = collection(this.firebaseFirestore, "lists");
      const listsQuery = query(
        listsCollectionRef,
        where("boardId", "==", boardId)
      );
      const listsSnapshot = await getDocs(listsQuery);

      // Étape 2: Supprimer les tâches pour chaque liste
      for (const listDoc of listsSnapshot.docs) {
        const listData = listDoc.data();
        const taskIds = listData.tasks || [];

        for (const taskId of taskIds) {
          const taskRef = doc(this.firebaseFirestore, "tasks", taskId);
          // Supprimer les sous-collections de la tâche
          await this.deleteSubCollections(taskRef, batch, [
            "items",
            "checklists",
          ]);
          batch.delete(taskRef); // Ajoutez la suppression de la tâche au batch ici
        }

        batch.delete(listDoc.ref); // Ajoutez la suppression de la liste au batch
      }

      // Étape 3: Supprimer le board
      batch.delete(boardRef);
      await batch.commit();
    } catch (error: any) {
      console.error("Error deleting board:", error);
      throw new Error("Failed to delete board");
    }
  }

  public async deleteList(listId: string): Promise<void> {
    try {
      const batch = writeBatch(this.firebaseFirestore);
      const listsCollectionRef = doc(this.firebaseFirestore, "lists", listId);
      const listDoc = await getDoc(listsCollectionRef);
      const taskIds = listDoc.data()?.tasks || [];

      for (const taskId of taskIds) {
        const taskRef = doc(this.firebaseFirestore, "tasks", taskId);

        await this.deleteSubCollections(taskRef, batch, [
          "items",
          "checklists",
        ]);
        batch.delete(taskRef);
      }

      batch.delete(listDoc.ref);
      await batch.commit();

    } catch (error: any) {
      console.error("Error deleting list:", error);
      throw new Error("Failed to delete list");
    }
  }

  private async deleteSubCollections(
    parentRef: DocumentReference,
    batch: WriteBatch,
    subCollections: string[]
  ): Promise<void> {
    for (const sub of subCollections) {
      const subCollectionRef = collection(parentRef, sub);
      const subDocs = await getDocs(subCollectionRef);

      for (const item of subDocs.docs) {
        await this.deleteSubCollections(item.ref, batch, subCollections); // Appel récursif
        batch.delete(item.ref); // Ajoutez la suppression de l'item au batch ici
      }
    }
  }

  public async deleteDocument(
    collectionName: string,
    id: string,
    subCollections: string[]
  ): Promise<void> {
    try {
      const batch = writeBatch(this.firebaseFirestore);
      const docRef = doc(this.firebaseFirestore, collectionName, id);

      if (subCollections.length > 0) {
        await this.deleteSubCollections(docRef, batch, subCollections);
      }
      batch.delete(docRef);
      await batch.commit();
    } catch (error: any) {
      console.error("Error deleting document:", error);
      if (error.code === "not-found") {
        throw new Error(`Document with id ${id} not found`);
      } else {
        throw new Error("Failed to delete document");
      }
    }
  }

  public async fetchDoc<T>({
    collectionName,
    documentId,
  }: {
    collectionName: string;
    documentId: string;
  }): Promise<T | null> {
    try {
      const docRef = doc(this.firebaseFirestore, collectionName, documentId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return { ...docSnap.data(), id: docSnap.id } as T;
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error fetching document", error);
      throw new Error("Failed to fetch data");
    }
  }

  public async fetchDocs<T>({
    collectionName,
    firestoreFilterFn,
  }: {
    collectionName: string;
    firestoreFilterFn?: (colRef: CollectionReference) => any;
  }): Promise<T[]> { // Changer le type de retour à T[]
    try {
      const colRef = collection(this.firebaseFirestore, collectionName);
      const q = firestoreFilterFn ? firestoreFilterFn(colRef) : colRef;
  
      const docSnap = await getDocs(q);      
      if (docSnap.empty) {
        return []; // Si la collection est vide, retourne un tableau vide
      }
  
      return docSnap.docs.map((doc) => ({
        ...doc.data() as T,
        id: doc.id,
      })) as T[];
    } catch (error) {
      console.error("Error fetching documents", error);
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
            id: docSnap.id,
          };
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

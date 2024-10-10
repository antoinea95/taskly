import { addDoc, collection, CollectionReference, deleteDoc, doc, getDoc, getDocs, onSnapshot, QuerySnapshot, updateDoc } from "firebase/firestore";
import { firebaseFirestore } from "../firebaseApp";

export class FirestoreService {

    private static firebaseFirestore = firebaseFirestore
     /**
   * Creates a new document in the specified Firestore collection.
   * @param collectionName - The name of the collection where the document will be created.
   * @param data - The data to be stored in the document (excluding the ID).
   * @returns The ID of the newly created document.
   * @throws Throws an error if document creation fails.
   */

  public static async createDocument<T>(
    collectionName: string,
    data: Omit<T, "id">
  ): Promise<string> {
    try {
      const docRef = collection(this.firebaseFirestore, collectionName);
      const snapshot = await addDoc(docRef, data);
      return snapshot.id
    } catch (error) {
      console.error("Error creating document:", error);
      throw new Error("Failed to create document");
    }
  }

  /**
   * Updates a document in the specified Firestore collection.
   * @param collectionName - The name of the collection containing the document.
   * @param data - The data to update the document with.
   * @param id - The ID of the document to update.
   * @returns A promise that resolves when the document is updated.
   * @throws Throws an error if the document update fails.
   */
  public static async updateDocument<T>(
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

    /**
   * Delete a document in a firestore collection.
   * @param collectionName - The Firestore collection of the document.
   * @param id - The ID of the document to delete
   * @returns A promise that resolves when the document is delete.
   * @throws Throw an error if document is not found.
   */
    public static async deleteDocument(
        collectionName: string,
        id: string
      ): Promise<void> {
        try {
          const docRef = doc(this.firebaseFirestore, collectionName, id);
          await deleteDoc(docRef)
        } catch (error: any) {
          console.error("Error deleting document:", error);
          if (error.code === "not-found") {
            throw new Error(`Document with id ${id} not found`);
          } else {
            throw new Error("Failed to delete document");
          }
        }
    }

     /**
   * Fetches a document from a specified collection using its ID.
   * @param collectionName - The name of the collection containing the document.
   * @param documentId - The ID of the document to fetch.
   * @returns The fetched document data, or null if not found.
   * @throws  Throws an error if fetching the document fails.
   */
  public static async fetchDoc<T>(
    collectionName: string,
    documentId: string
  ): Promise<T | null> {
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

  /**
   * Fetches multiple documents from a specified collection, optionally applying a filter function.
   * @param collectionName - The name of the collection to fetch documents from.
   * @param filterFn - An optional function to filter the query for the collection.
   * @returns A promise that resolves to an array of documents of type T.
   * @throws Throws an error if fetching documents fails.
   */
  public static async fetchDocs<T>(
    collectionName: string,
    filterFn?: (colRef: CollectionReference) => any
  ): Promise<T[]> {
    try {
      const colRef = collection(this.firebaseFirestore, collectionName);
      const q = filterFn ? filterFn(colRef) : colRef;

      const docSnap = await getDocs(q);
      if (docSnap.empty) {
        return [];
      }

      return docSnap.docs.map((doc) => ({
        ...(doc.data() as T),
        id: doc.id,
      })) as T[];
    } catch (error) {
      console.error("Error fetching documents", error);
      throw new Error("Failed to fetch data");
    }
  }

  /**
   * Subscribes to a document in a specified collection and invokes a callback when the document changes.
   * @param collectionName - The name of the collection containing the document.
   * @param documentId - The ID of the document to subscribe to.
   * @param callback - A function to be called with the updated document data or `null` if the document is deleted.
   * @param errorMessage - A custom error message to log if the subscription fails.
   * @returns A function to unsubscribe from the document changes.
   * @throws Throws an error if subscribing to the document fails.
   */
  public static subscribeToDocument<T>(
    collectionName: string,
    documentId: string,
    callback: (data: T) => void,
    errorMessage: string
  ): () => void {
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
          throw new Error("Error while subscribing to document");
        }
      },
      (error) => {
        console.error(`${errorMessage}`, error);
        throw new Error("Error while subscribing to document");
      }
    );

    return unsubscribe;
  }

  /**
   * Subscribes to a collection of documents and invokes a callback whenever the collection changes.
   * @param collectionName - The name of the collection to subscribe to.
   * @param callback - A function to be called with the updated array of documents.
   * @param errorMessage - A custom error message to log if the subscription fails.
   * @param filterFn - An optional function to filter or modify the query for the collection.
   * @returns A function to unsubscribe from the collection changes.
   * @throws Throws an error if subscribing to the collection fails.
   */
  public static subscribeToCollection<T>(
    collectionName: string,
    callback: (data: T[]) => void,
    errorMessage: string,
    filterFn?: (colRef: CollectionReference) => any
  ): () => void {
    const colRef = collection(this.firebaseFirestore, collectionName);
    const q = filterFn ? filterFn(colRef) : colRef;

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
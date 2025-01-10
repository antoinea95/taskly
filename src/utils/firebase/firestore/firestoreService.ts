import {
  addDoc,
  collection,
  CollectionReference,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  QueryConstraint,
  QuerySnapshot,
  updateDoc,
  where,
} from "firebase/firestore";
import { firebaseFirestore } from "../firebaseApp";
import { BatchService } from "./batchService";
import { TaskCommentType, TaskType } from "@/utils/types/tasks.types";
import { BoardType } from "@/utils/types/boards.types";

export class FirestoreService {
  private static firebaseFirestore = firebaseFirestore;
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
      return snapshot.id;
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
  ): Promise<string> {
    try {
      const docRef = doc(this.firebaseFirestore, collectionName, id);
      await updateDoc(docRef, data);
      return id;
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
      await deleteDoc(docRef);
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
   * Removes the user from the members list of documents or deletes the document
   * if the user is the creator. The function operates on any Firestore collection.
   *
   * @template T - The type of document that must include `members`, `id`, and optionally `creator`.
   * @param {string} collectionName - The name of the Firestore collection (e.g., "boards", "tasks").
   * @param {string} userId - The ID of the user to remove from the members list.
   * @returns A promise that resolves when all documents have been updated or deleted.
   *
   * @example
   * // Remove the user from boards or delete the board if they are the creator
   * await FirestoreService.removeMemberAndDeleteDocument<BoardType>("boards", user.uid);
   */
  public static async removeMemberAndDeleteDocument(
    collectionName: string,
    userId: string
  ): Promise<void> {
    // Fetch documents where the user is a member (for boards)
    const boards = await FirestoreService.fetchDocs<BoardType>(
      collectionName,
      () => [where("members", "array-contains", userId)]
    );

    // Handle update or deletion of boards
    if (boards.length) {
      await Promise.all(
        boards.map(async (board) => {
          // If the user is the creator, delete the entire board
          if (board.creator && board.creator === userId) {
            await BatchService.deleteBoard(board.id);
          } else {
            // Update members by removing the user from the members list
            await this.updateMembers(board, userId, collectionName);
          }
        })
      );
    }

    // Fetch tasks where the user is mentioned in the comments (but not necessarily a member)
    const allTasks = await FirestoreService.fetchDocs<TaskType>(collectionName); // Assuming all tasks are in the same collection

    const tasksToRemoveCommentsFrom = allTasks.filter((task) =>
      task.comments?.some((comment) => comment.userId === userId)
    );

    // Handle update of tasks
    if (tasksToRemoveCommentsFrom.length) {
      await Promise.all(
        tasksToRemoveCommentsFrom.map(async (task) => {
          await this.removeUserComments(task, userId, collectionName);
        })
      );
    }
  }

  /**
   * Update the members of a document by removing the specified user.
   *
   * @param doc - The document to update.
   * @param userId - The user ID to remove.
   * @param collectionName - The name of the collection.
   */
  private static async updateMembers<
    T extends { members?: string[]; id: string },
  >(doc: T, userId: string, collectionName: string): Promise<void> {
    if (doc.members) {
      const updatedMembers = doc.members.filter((member) => member !== userId);

      // Update the document with the new members list
      await FirestoreService.updateDocument<T>(
        collectionName,
        { members: updatedMembers } as Partial<T>,
        doc.id
      );
    }
  }

  /**
   * Remove the user's comments from a task.
   *
   * @param task - The task to update.
   * @param userId - The user ID to remove.
   * @param collectionName - The name of the collection.
   */
  private static async removeUserComments<
    T extends { comments?: TaskCommentType[]; id: string },
  >(task: T, userId: string, collectionName: string): Promise<void> {
    if (task.comments) {
      const updatedComments = task.comments.filter(
        (comment) => comment.userId !== userId
      );

      // Update the task with the new comments list
      await FirestoreService.updateDocument<T>(
        collectionName,
        { comments: updatedComments } as Partial<T>,
        task.id
      );
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
    filterFn?: (colRef: CollectionReference) => QueryConstraint[]
  ): Promise<T[]> {
    try {
      const colRef = collection(this.firebaseFirestore, collectionName);
      const q = filterFn ? query(colRef, ...filterFn(colRef)) : colRef;

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
    onError: (error: Error) => void,
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
          onError(new Error);
        }
      },
      (error) => {
        onError(error);
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
    callback: (data: T) => void,
    onError: (error: Error) => void,
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
        })) as T;
        callback(docs);
      },
      (error) => {
        console.log("null")
        onError(error)
      }
    );

    return unsubscribe;
  }
}

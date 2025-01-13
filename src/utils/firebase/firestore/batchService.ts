import { collection, doc, DocumentData, DocumentReference, DocumentSnapshot, getDoc, getDocs, query, where, WriteBatch, writeBatch } from "firebase/firestore";
import { firebaseAuth, firebaseFirestore, firebaseStorage } from "../firebaseApp";
import { TaskType } from "@/utils/types/tasks.types";
import { deleteObject, ref } from "firebase/storage";


export class BatchService {

    private static firebaseFirestore = firebaseFirestore;

      /**
   * Deletes a board and all associated lists and tasks from Firestore.
   * @param boardId - The ID of the board to delete.
   * @returns A promise that resolves when the board and its associated data are deleted.
   * @throws Throws an error if deletion fails.
   */
  public static async deleteBoard(boardId: string): Promise<void> {
    try {
      const batch = writeBatch(this.firebaseFirestore);
      const boardRef = doc(this.firebaseFirestore, "boards", boardId);

      // Delete associated lists and tasks
      await this.deleteListsAndTasks(boardId, batch);

      // Delete the board
      batch.delete(boardRef);
      await batch.commit();
    } catch (error: any) {
      console.error("Error deleting board:", error);
      throw new Error("Failed to delete board");
    }
  }

  /**
   * Deletes a list and all associated tasks from Firestore.
   * @param listId - The ID of the list to delete.
   * @returns A promise that resolves when the list and its associated data are deleted.
   * @throws Throws an error if deletion fails.
   */
  public static async deleteList(listId: string): Promise<void> {
    try {
      const batch = writeBatch(this.firebaseFirestore);
      const listRef = doc(this.firebaseFirestore, "lists", listId);
      
      const listDoc = await getDoc(listRef);
      if (!listDoc.exists()) {
        throw { code: "NOT_FOUND", message: `List with ID ${listId} not found.` };
      }

      const listData = listDoc.data();
      const boardId = listData?.boardId;

      if (!boardId) {
        throw { code: "NOT_FOUND", message: `List with ID ${listId} is not associated with a board.` };
      }

      const boardRef = doc(this.firebaseFirestore, "boards", boardId);
      const boardDoc = await getDoc(boardRef);

      if (!boardDoc.exists()) {
        throw { code: "NOT_FOUND", message: `Board with ID ${boardId} not found.` };
      }

      const boardData = boardDoc.data();
      const lists = boardData?.lists || [];

      const updatedLists = lists.filter((id: string) => id !== listId);

      batch.update(boardRef, { lists: updatedLists });

      // Retrieve list's tasks and delete them
      await this.deleteTasks(listId, batch);

      // Delete the list
      batch.delete(listRef);
      await batch.commit();
    } catch (error) {
      console.error("Error deleting list:", error);
      throw error;
    }
  }

    /**
     * Delete a document in a Firestore collection and its associated files in Firebase Storage.
     * @param id - The ID of the document to delete.
     * @returns A promise that resolves when the document and files are deleted.
     * @throws Throw an error if the document is not found.
     */
    public static async deleteTaskFilesInStorage(taskDoc: DocumentSnapshot<DocumentData, DocumentData>): Promise<void> {
      try {
        const userId = firebaseAuth.currentUser?.uid;
        if (!userId) throw { code: "DOCUMENT_NOT_FOUND", message: "User not authenticated" };

  
        const task = taskDoc.data() as TaskType;
        const files = task.files;
        if (!files || files.length === 0) return;
  
        // Extraire les chemins et supprimer les fichiers en parallèle
        const deletePromises = files.map(async (file) => {
          const path = `${userId}/tasks/${file.name}`;
          console.log(path);
          const fileRef = ref(firebaseStorage, path);
          await deleteObject(fileRef);
        });
  
        await Promise.all(deletePromises);
      } catch (error: any) {
        console.error("Error deleting task files:", error);
        throw new Error(error.message || "Failed to delete files");
      }
    }

  /**
   * Deletes a task from Firestore.
   * @param taskId - The ID of the task to delete.
   * @returns A promise that resolves when the task is deleted.
   * @throws Throws an error if deletion fails.
   */
  public static async deleteTask(taskId: string): Promise<void> {
    try {
      const batch = writeBatch(this.firebaseFirestore);
      const taskRef = doc(this.firebaseFirestore, "tasks", taskId);

       // Validate if the task exists
       const taskDoc = await getDoc(taskRef);
       if (!taskDoc.exists()) {
        throw { code: "NOT_FOUND", message: `Task with ID ${taskId} not found.` };
       }
      
       await this.deleteTaskFilesInStorage(taskDoc);

      // Delete sub-collections of the task
      await this.deleteSubCollections(taskRef, batch, ["items", "checklists"]);

      // Delete the task
      batch.delete(taskRef);
      await batch.commit();
    } catch (error:any) {
      console.error("Error deleting task:", error);
      throw new Error(error.message ||`Failed to delete task with ID ${taskId}`);
    }
  }

  /**
   * Deletes a checklist from a task.
   * @param checklistId - The ID of the checklist to delete.
   * @param taskId - The ID of the task containing the checklist.
   * @returns A promise that resolves when the checklist is deleted.
   * @throws Throws an error if deletion fails.
   */
  public static async deleteCheckList(
    checklistId: string,
    taskId: string
  ): Promise<void> {
    try {
      const batch = writeBatch(this.firebaseFirestore);
      const checklistRef = doc(
        this.firebaseFirestore,
        `tasks/${taskId}/checklists`,
        checklistId
      );

        // Validate if the checklist exists
        const checklistDoc = await getDoc(checklistRef);
        if (!checklistDoc.exists()) {
          throw { code: "NOT_FOUND", message: `Checklist with ID ${checklistId} not found.` };
        }

      // Delete sub-collections of the checklist
      await this.deleteSubCollections(checklistRef, batch, ["items"]);

      // Delete the checklist
      batch.delete(checklistRef);
      await batch.commit();
    } catch (error: any) {
      console.error("Error deleting checklist:", error);
      throw new Error(error.message || `Failed to delete checklist with ID ${checklistId}`);
    }
  }

  /**
   * Deletes all tasks associated with a given list, and its subcollections.
   * @param listId - The ID of the list whose tasks are to be deleted.
   * @param batch - The Firestore batch to which deletions are added.
   */
  private static async deleteTasks(listId: string, batch: WriteBatch): Promise<void> {
    const listRef = doc(this.firebaseFirestore, "lists", listId);
    const listDoc = await getDoc(listRef);

    if (!listDoc.exists()) {
      throw { code: "NOT_FOUND", message: `List with ID ${listId} not found.` };
      }

    const taskIds = listDoc.data()?.tasks || [];

    for (const taskId of taskIds) {
      const taskRef = doc(this.firebaseFirestore, "tasks", taskId);
      const taskDoc = await getDoc(taskRef);

      if (!taskDoc.exists()) {
        throw { code: "NOT_FOUND", message: `Task with ID ${taskId} not found.` };
      }
      
      await this.deleteTaskFilesInStorage(taskDoc);
      await this.deleteSubCollections(taskRef, batch, ["items", "checklists"]);
      batch.delete(taskRef);
    }
  }

  /**
   * Deletes all lists and their associated tasks for a given board.
   * @param boardId - The ID of the board whose lists and tasks are to be deleted.
   * @param batch - The Firestore batch to which deletions are added.
   */
  private static async deleteListsAndTasks(
    boardId: string,
    batch: WriteBatch
  ): Promise<void> {
    const listsCollectionRef = collection(this.firebaseFirestore, "lists");
    const listsQuery = query(
      listsCollectionRef,
      where("boardId", "==", boardId)
    );
    const listsSnapshot = await getDocs(listsQuery);

    for (const listDoc of listsSnapshot.docs) {
      const listId = listDoc.id;
      await this.deleteTasks(listId, batch);
      batch.delete(listDoc.ref);
    }
  }

  /**
   * Deletes sub-collections for a given Firestore document.
   * @param parentRef - The Firestore document reference whose sub-collections need to be deleted.
   * @param batch - The Firestore batch to which deletions are added.
   * @param subCollections - The names of the sub-collections to delete.
   */
  private static async deleteSubCollections(
    parentRef: DocumentReference,
    batch: WriteBatch,
    subCollections?: string[]
  ): Promise<void> {
    if (subCollections) {
      for (const sub of subCollections) {
        const subCollectionRef = collection(parentRef, sub);
        const subDocs = await getDocs(subCollectionRef);

        for (const item of subDocs.docs) {
          await this.deleteSubCollections(item.ref, batch, subCollections); // Recursive call
          batch.delete(item.ref); // Add item deletion to batch
        }
      }
    }
  }
}
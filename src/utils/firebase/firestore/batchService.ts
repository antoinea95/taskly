import { collection, doc, DocumentReference, getDoc, getDocs, query, where, WriteBatch, writeBatch } from "firebase/firestore";
import { firebaseFirestore } from "../firebaseApp";

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
        throw new Error(`List with ID ${listId} not found.`);
      }

      // Retrieve list's tasks and delete them
      await this.deleteTasks(listId, batch);

      // Delete the list
      batch.delete(listRef);
      await batch.commit();
    } catch (error: any) {
      console.error("Error deleting list:", error);
      throw new Error(`Failed to delete list with ID ${listId}`);
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
        throw new Error(`Task with ID ${taskId} not found.`);
       }

      // Delete sub-collections of the task
      await this.deleteSubCollections(taskRef, batch, ["items", "checklists"]);

      // Delete the task
      batch.delete(taskRef);
      await batch.commit();
    } catch (error: any) {
      console.error("Error deleting task:", error);
      throw new Error(`Failed to delete task with ID ${taskId}`);
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
            throw new Error(`Checklist with ID ${checklistId} not found.`);
        }

      // Delete sub-collections of the checklist
      await this.deleteSubCollections(checklistRef, batch, ["items"]);

      // Delete the checklist
      batch.delete(checklistRef);
      await batch.commit();
    } catch (error: any) {
      console.error("Error deleting checklist:", error);
      throw new Error(`Failed to delete checklist with ID ${checklistId}`);
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
        throw new Error(`List with ID ${listId} not found.`);
      }

    const taskIds = listDoc.data()?.tasks || [];

    for (const taskId of taskIds) {
      const taskRef = doc(this.firebaseFirestore, "tasks", taskId);
      const taskDoc = await getDoc(taskRef);

      if (!taskDoc.exists()) {
        throw new Error(`Task with ID ${taskId} not found.`);
      }

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

        if (subDocs.empty) {
            throw new Error(`No documents found in sub-collection ${sub}.`);
          }
  

        for (const item of subDocs.docs) {
          await this.deleteSubCollections(item.ref, batch, subCollections); // Recursive call
          batch.delete(item.ref); // Add item deletion to batch
        }
      }
    }
  }
}
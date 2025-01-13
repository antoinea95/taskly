import { deleteObject, getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { firebaseAuth, firebaseStorage, firebaseFirestore } from "../firebaseApp";
import { FirestoreService } from "../firestore/firestoreService";
import { doc, getDoc } from "firebase/firestore";
import { TaskType } from "@/utils/types/tasks.types";
export class StorageService {
  private static firebaseStorage = firebaseStorage;
  private static firebaseFirestore = firebaseFirestore;

  /**
   * Imports a file to Firebase Storage and updates the user profile with the file's URL.
   * @param file - The file to be uploaded.
   * @param documentId - The ID of the document to update with the file.
   * @param folder - the name of the folder
   * @param collectionName - the collection Name of the document to update
   * @throws Throws an error if file upload or update fails.
   */
  public static async ImportFile<T>(file: File | null, documentId: string, folder: string, collectionName: string) {
    try {
      let updateData: Partial<T> = {};
      const user = firebaseAuth.currentUser;

      if (!file) {
        throw { code: "FILE_MISSING", message: "No file provided. Please upload a file." };
      }

      const storageRef = ref(this.firebaseStorage, `/${user?.uid}/${folder}/${file.name}`);
      await uploadBytes(storageRef, file);
      const downloadUrl = await getDownloadURL(storageRef);

      if (collectionName === "users") {
        updateData = { photoURL: downloadUrl } as T;
      } else if (collectionName === "tasks") {
        const docRef = doc(this.firebaseFirestore, collectionName, documentId);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
          throw { code: "DOCUMENT_NOT_FOUND", message: `No task with ID ${documentId} found.` };
        }

        const data = docSnap.data() as TaskType;
        updateData = data.files
          ? ({ files: [...data.files, { name: file.name, url: downloadUrl, type: file.type }] } as T)
          : ({ files: [{ name: file.name, url: downloadUrl, type: file.type }] } as T);
      }

      await FirestoreService.updateDocument<T>(collectionName, updateData, documentId);
    } catch (error) {
      console.error("Error during file upload:", error);
      throw error;
    }
  }

  public static async deleteFileFromTask(fileName: string, taskId: string) {
    const userId = firebaseAuth.currentUser?.uid;
    if (!userId) throw { code: "USER_NOT_FOUND", message: "User not authenticated" };
    const taskRef = doc(this.firebaseFirestore, "tasks", taskId);
    const taskDoc = await getDoc(taskRef);
    if (!taskDoc.exists()) throw { code: "TASK_NOT_FOUND", message: `task with id ${taskId} doesn't exists` };

    const task = taskDoc.data() as TaskType;
    const files = task.files;
    const updatedFiles = files?.filter((fileFromDb) => fileFromDb.name !== fileName);

    await FirestoreService.updateDocument<TaskType>("tasks", { files: updatedFiles }, taskId);

    const fileRef = ref(this.firebaseStorage, `${userId}/tasks/${fileName}`);
    await deleteObject(fileRef);
  }
}

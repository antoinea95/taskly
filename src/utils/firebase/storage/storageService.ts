import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { firebaseStorage } from "../firebaseApp";
import { FirestoreService } from "../firestore/firestoreService";
import { UserType } from "@/utils/types";

export class StorageService {
  private static firebaseStorage = firebaseStorage;

  /**
   * Imports a file to Firebase Storage and updates the user profile with the file's URL.
   * @param file - The file to be uploaded.
   * @param userId - The ID of the user uploading the file.
   * @throws Throws an error if file upload or update fails.
   */
  public static async ImportFile(file: File, userId: string) {
    if (!file) return;

    const storageRef = ref(
      this.firebaseStorage,
      `profile/${userId}/${file.name}`
    );

    try {
      await uploadBytes(storageRef, file);
      const downloadUrl = await getDownloadURL(storageRef);

      await FirestoreService.updateDocument<UserType>(
        "users",
        {
          photoURL: downloadUrl,
        },
        userId
      );
    } catch (error) {
      console.error("Error during file upload:", error);
    }
  }
}

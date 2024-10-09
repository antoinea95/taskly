import {
    EmailAuthProvider,
    getAuth,
    reauthenticateWithCredential,
  } from "firebase/auth";
  
  export const reauthenticateUser = async (password: string) => {
    const { currentUser: user } = getAuth();
  
    if (user && user.email) {
      try {
        const credential = EmailAuthProvider.credential(user.email, password);
        await reauthenticateWithCredential(user, credential);
      } catch (error) {
        console.error(error)
        throw new Error("You provide a wrong password.");
      }
    } else {
      throw new Error("User not authenticated.");
    }
  };
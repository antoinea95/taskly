import { BoardType } from "@/utils/types/boards.types";
import { FirestoreService } from "@/utils/firebase/firestore/firestoreService";
import { Invitation } from "@/utils/types/auth.types";
import { AuthForm } from "./AuthForm";
import { User } from "firebase/auth";
import { useNavigate } from "react-router-dom";

/**
 * Render a component allow user to create an account with the invitation email
 *
 */
const CompleteSignup = () => {

  const navigate = useNavigate();

  // Retrieve the invitation in firestore, add the user to the board and delete invitation, finally
  // redirect to the HomePage
  const addUserToBoard = async (user: User) => {
    if(!user.email) return;
    try {
      console.log("exe");
      const invitation = await FirestoreService.fetchDoc<Invitation>("invitations", user.email);

      if (!invitation) throw "Invitation not found";

      const board = await FirestoreService.fetchDoc<BoardType>("boards", invitation.boardId);
      if (!board) throw "No board found";

      await FirestoreService.updateDocument<BoardType>(
        "boards",
        {
          members: [...board.members, user.uid],
        },
        invitation.boardId
      );
      await FirestoreService.deleteDocument("invitations", invitation.email);
      navigate("/");
    } catch (error: any) {
      throw new Error(error);
    }
  };

  return (
    <div className="flex flex-col justify-center h-full w-full max-w-lg xl:max-w-2xl mb-20">
        <AuthForm isUserInvitation={true} addUserToBoard={addUserToBoard} />
    </div>
  );
};

export default CompleteSignup;

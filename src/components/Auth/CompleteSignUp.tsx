import { useSearchParams } from "react-router-dom";
import { useGetEmailInvitation } from "@/utils/hooks/FirestoreHooks/queries/useGetEmailInvitation";
import { BoardType } from "@/utils/types/boards.types";
import { FirestoreService } from "@/utils/firebase/firestore/firestoreService";
import { deleteDoc, doc } from "firebase/firestore";
import { firebaseFirestore } from "@/utils/firebase/firebaseApp";
import { UpdatePassword } from "./UpdatePassword";
import { Button } from "../ui/button";
import { useSignWithLink } from "@/utils/hooks/FirestoreHooks/auth/useSign";
import { NotificationBanner } from "../Notification/NotificationBanner";
import { CheckCircle } from "lucide-react";

/**
 * Render a component allow user to connect with the invitation email and create a new password
 * 
 */
const CompleteSignup = () => {
  const [searchParams] = useSearchParams();
  const invitedEmail = searchParams.get("email"); // Email invité depuis l'URL
  const { data: invitation } = useGetEmailInvitation(invitedEmail ? invitedEmail : undefined);
  const { mutateAsync, data: user, isPending, isSuccess, isError } = useSignWithLink();

  // 1️⃣ Connexion avec Email
  const handleEmailSignup = async () => {
    if (!invitedEmail || !invitation) return;
    const user = await mutateAsync({ email: invitedEmail });
    checkEmail(user.uid, user.email);
  };

  const checkEmail = (uid: string, email: string | null) => {
    if (!email) return;
    addUserToBoard(uid);
  };

  // 4️⃣ Ajouter l'utilisateur au board après confirmation
  const addUserToBoard = async (uid: string) => {
    if (!invitation || !invitation[0].boardId) return;

    try {
      const board = await FirestoreService.fetchDoc<BoardType>("boards", invitation[0].boardId);
      if (!board) return;

      await FirestoreService.updateDocument<BoardType>(
        "boards",
        {
          members: [...board.members, uid],
        },
        invitation[0].boardId
      );
      await deleteDoc(doc(firebaseFirestore, "invitations", invitedEmail as string));
    } catch (error: any) {
      throw new Error(error);
    }
  };

  return (
        <div className="flex flex-col justify-center h-full w-full max-w-lg xl:max-w-2xl mb-20">
          <section className="mb-10 space-y-2">
            <h2 className="md:text-4xl text-xl font-bold w-2/3">You have been invited on Taskly.</h2>
            {!user ? (
              <Button onClick={handleEmailSignup} className="rounded-xl w-full" disabled={isPending}>
                Click to sign in
              </Button>
            ) : (
              <p className="p-3 bg-green-500 text-center text-white rounded-xl font-semibold flex items-center gap-2 justify-center">
                <CheckCircle size={16} /> Successfully logged with {user.email}
              </p>
            )}
            <NotificationBanner content={isSuccess ? "Success" : "Error while sign in"} isError={isError} isSuccess={isSuccess} />
          </section>

          <h3 className="font-semibold text-xl mb-6">Then, define your password :</h3>
          <UpdatePassword isNewUser={true} />
        </div>
  );
};

export default CompleteSignup;

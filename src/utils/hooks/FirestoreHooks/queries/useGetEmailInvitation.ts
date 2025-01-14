import { useFirestoreQuery } from "./useFirestoreQuery";
import { FieldValue, where } from "firebase/firestore";

type Invitation = {
  boardId: string;
  email: string;
  invitedAt: FieldValue;
  status: string;
};

export const useGetEmailInvitation = (email?: string) => {
  return useFirestoreQuery<Invitation[]>({
    collectionName: "invitations",
    key: ["invitation", email],
    filterFn: () => [where("email", "==", email)],
    enabled: !!email,
  });
};

import { FieldValue } from "firebase/firestore";

export type UserType = {
    id: string;
    email: string;
    name: string;
    photoURL?: string
}

export type Invitation = {
  boardId: string;
  email: string;
  invitedAt: FieldValue;
  status: string;
};
import FirestoreApi from "@/firebase/FirestoreApi";
import { LogOut } from "lucide-react";

export const Header = () => {
  const user = FirestoreApi.getCurrentUser();

  return (
    <header className="border flex justify-between px-8 py-3">
      <p className="font-bold">Welcome {user?.displayName}</p>
      <button className="p-1" onClick={() => FirestoreApi.signOut()}>
        <LogOut />
      </button>
    </header>
  );
};

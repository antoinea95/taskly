import { useAuthStore } from "@/store/authStore";
import { LogOut } from "lucide-react";

export const Header = () => {
  const { user, logOut } = useAuthStore();
  return (
    <header className="border flex justify-between px-8 py-3">
      <p className="font-bold">Welcome {user?.displayName}</p>
      <button className="p-1" onClick={logOut}>
        <LogOut />
      </button>
    </header>
  );
};

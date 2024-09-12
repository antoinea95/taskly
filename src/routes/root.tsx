import FirestoreApi from "@/firebase/FirestoreApi";
import { LogOut } from "lucide-react";
import { Outlet, useNavigate } from "react-router-dom";
import { Loader } from "@/components/ui/loader";
import { useAuth } from "@/firebase/authHook";

export const Root = () => {
  const {currentUser, isLoading} = useAuth();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader data={{ color: "black", size: "6rem" }} />
      </div>
    );
  }

  if(!currentUser) {
    navigate("/login");
  }

  return (
    <main>
      <header className="border flex justify-between px-8 py-3">
        <p className="font-bold">Welcome {currentUser?.displayName}</p>
        <button className="p-1" onClick={() => FirestoreApi.signOut()}>
          <LogOut />
        </button>
      </header>
      <Outlet />
    </main>
  );
};
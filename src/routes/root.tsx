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
    <main className="font-outfit bg-red-200 flex">
      <nav className="w-1/5 border h-screen">
        <ul>Test</ul>
        <ul>
        <button className="p-1" onClick={() => FirestoreApi.signOut()}>
          <LogOut />
        </button>
        </ul>
      </nav>
      <div className="w-4/5 bg-green-200">
      <Outlet />
      </div>
    </main>
  );
};
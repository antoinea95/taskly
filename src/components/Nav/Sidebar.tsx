import { ClipboardList, Dot, LogOut } from "lucide-react";
import FirestoreApi from "@/firebase/FirestoreApi";
import { useGetBoards } from "@/firebase/fetchHook";
import { useAuth } from "@/firebase/authHook";
import { NavLink, useNavigate } from "react-router-dom";
import { AddBoard } from "../Board/AddBoard";
import { Skeleton } from "../ui/skeleton";
import { Member } from "../Members/Member";

export const Sidebar = () => {
  const { currentUser } = useAuth();
  const userId = currentUser?.id;
  const { data: boards, isLoading } = useGetBoards(userId ?? "");
  const navigate = useNavigate();

  const handleLogOut = async () => {
    await FirestoreApi.signOut();
    navigate("/login");
  };

  if (!currentUser && isLoading) {
    <p>Please sign In</p>;
  }

  return (
    <section className="font-outfit flex-1 flex flex-col pb-2">
      <div className="px-3 font-medium bg-gray-50 p-3 rounded-xl space-y-2">
        <h2 className="uppercase flex items-center gap-2">
        <ClipboardList size={20} /> 
          Boards
        </h2>
        {boards && boards.length > 0 ?
          boards.map((board) => (
            <NavLink
              key={board.id}
              to={`/${board.id}`}
              className={({ isActive }) =>
                ` text-base rounded-xl  w-full flex items-center p-2 hover:bg-gray-300 ${isActive ? "bg-gray-300" : ""}`
              }
            >
              <Dot size={20}/> {board.title}
            </NavLink>
          )) : <p className="w-full flex items-center justify-center text-gray-300 uppercase py-2">No board</p>}
        <AddBoard />
      </div>
      <div className="mb-0 mt-auto">
        {currentUser ? (
          <NavLink
            to={`/profile`}
            className="flex items-center gap-2 w-full p-2 rounded-xl hover:bg-gray-200 cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Member userId={currentUser.id} type="avatar" />
              {currentUser.name}
            </div>
          </NavLink>
        ) : (
          <Skeleton className="w-60 h-10" />
        )}
        <button
          className="flex items-center gap-2 w-full p-2 rounded-xl hover:bg-gray-200"
          onClick={handleLogOut}
        >
          <LogOut /> Log out
        </button>
      </div>
    </section>
  );
};

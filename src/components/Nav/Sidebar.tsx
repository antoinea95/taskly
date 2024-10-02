import { Circle, ClipboardList, House, LogOut, Plus, User } from "lucide-react";
import FirestoreApi from "@/firebase/FirestoreApi";
import { useGetBoards } from "@/firebase/fetchHook";
import { useAuth } from "@/firebase/authHook";
import { Accordion, AccordionContent, AccordionTrigger } from "../ui/accordion";
import { AccordionItem } from "@radix-ui/react-accordion";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Modal } from "../ui/Modal";
import { useState } from "react";
import { Button } from "../ui/button";
import { AddBoard } from "../Board/AddBoard";

export const Sidebar = () => {
  const { currentUser } = useAuth();
  const userId = currentUser?.id
  const { data: boards, isLoading } = useGetBoards(userId ?? "");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogOut = async () => {
    await FirestoreApi.signOut();
    navigate("/login")
  };

  if(!currentUser && isLoading) {
    <p>Please sign In</p>
  }

  return (
    <ul className="font-outfit flex-1 flex flex-col pb-2">
    <li>
        <Link
          to={"/"}
          className="flex items-center gap-2 w-full p-2 rounded-xl hover:bg-gray-200 cursor-pointer"
        >
          <House /> Home
        </Link>
      </li>
      <li>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="boards">
            <AccordionTrigger className="flex items-center gap-2 w-full p-2 rounded-xl hover:bg-gray-200 hover:no-underline cursor-pointer">
              <p className="flex items-center gap-2 w-full text-base font-normal">
                <ClipboardList />
                Boards
              </p>
            </AccordionTrigger>
            <AccordionContent className="m-2">
              {boards && boards.map((board) => (
                <NavLink
                 key={board.id}
                  to={`/${board.id}`}
                  className={({ isActive }) =>
                    ` text-base rounded-xl  w-full flex items-center gap-2 p-2 my-2 hover:bg-gray-200 ${isActive ? "bg-gray-200" : ""}`
                  }
                >
                  <Circle size={8} strokeWidth={4} /> {board.title}
                </NavLink>
              ))}
              <Modal
                title="Add a new board"
                setIsModalOpen={setIsModalOpen}
                isModalOpen={isModalOpen}
              >
                <Button onClick={() => setIsModalOpen(true)} className="flex justify-start items-center gap-2 py-5 px-2 w-full rounded-xl text-base text-white bg-black mt-2">
                  <Plus
                  color="white"
                    size={10}
                    strokeWidth={2}
                  />
                  New board
                </Button>
                <AddBoard setIsModalOpen={setIsModalOpen} />
              </Modal>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </li>
      <li>
        <Link
          to={"/profile"}
          className="flex items-center gap-2 w-full p-2 rounded-xl hover:bg-gray-200 cursor-pointer"
        >
          <User /> Profile
        </Link>
      </li>
      <li className="mt-auto mb-0">
        <button
          className="flex items-center gap-2 w-full p-2 rounded-xl hover:bg-gray-200"
          onClick={handleLogOut}
        >
          <LogOut /> Log out
        </button>
      </li>
    </ul>
  );
};

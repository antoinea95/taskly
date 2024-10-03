import { Dispatch, SetStateAction } from "react";
import { Button } from "../ui/button";
import { UserPlus } from "lucide-react";

export const MemberButton = ({
  setIsOpen,
  type,
}: {
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  type: "tasks" | "boards";
}) => {
  const className =
    type === "tasks"
      ? "w-full py-6 rounded-xl bg-gray-100 text-black flex gap-2 shadow-none border-none hover:bg-black hover:text-white"
      : "bg-gray-100 border-none shadow-none text-black flex items-center justify-start overflow-hidden rounded-xl w-12 h-10 p-0 hover:w-72 hover:justify-center hover:bg-gray-300 transition-all duration-200";

  return (
    <Button onClick={() => setIsOpen(true)} className={`${className} animate-fade-in`}>
      <UserPlus size={18} className={`shrink-0 ${type === "boards" ? "w-12" : ""}`} />
      {type === "tasks" ? "Assigned to" : "Add a member"}
    </Button>
  );
};

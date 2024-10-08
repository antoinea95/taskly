import { Dispatch, SetStateAction } from "react";
import { Button } from "../ui/button";
import { X } from "lucide-react";

export const CloseButton = ({
  setIsOpen,
}: {
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  return (
    <Button
      type="button"
      className={`w-full h-10 px-3 rounded-xl bg-gray-200 text-black flex gap-2 shadow-none border-none hover:bg-gray-300 `}
      onClick={() => setIsOpen(false)}
    >
      <X size={16} /> Cancel
    </Button>
  );
};

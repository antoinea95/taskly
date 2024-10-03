import { Dispatch, PropsWithChildren, SetStateAction } from "react";
import { Button } from "../ui/button";

export const ToggleButton = ({
  setIsOpen,
  children,
}: PropsWithChildren<{ setIsOpen: Dispatch<SetStateAction<boolean>> }>) => {
  return (
    <Button
      onClick={() => setIsOpen(true)}
      className="w-full py-6 rounded-xl bg-gray-100 text-black flex gap-2 shadow-none border-none hover:bg-black hover:text-white animate-fade-in"
    >
      {children}
    </Button>
  );
};

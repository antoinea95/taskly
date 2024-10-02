import { Dispatch, PropsWithChildren, SetStateAction } from "react";
import { Button } from "../ui/button";

export const CloseButton = ({
  setIsOpen,
  children,
}: PropsWithChildren<{ setIsOpen: Dispatch<SetStateAction<boolean>> }>) => {
  return (
    <Button
    type="button"
    className={`w-fit h-10 px-3 rounded-xl bg-transparent text-black flex gap-2 shadow-none border-none hover:bg-gray-200 `}
    onClick={() => setIsOpen(false)}
  >
    {children}
  </Button>
  );
};

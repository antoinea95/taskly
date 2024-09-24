import { Cross } from "lucide-react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogClose } from "./dialog";
import { PropsWithChildren } from "react";

type DialogType = {
  dialogName: string;
  setIsModalOpen: (open: boolean) => void;
  isModalOpen: boolean;
};

export const Modal = ({
  dialogName,
  setIsModalOpen,
  isModalOpen,
  children,
}: PropsWithChildren<DialogType>) => {
  
  const [trigger, ...modalContent] = Array.isArray(children) ? children : [children];

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle className="text-3xl font-normal">{dialogName}</DialogTitle>
        </DialogHeader>
        {modalContent}
      </DialogContent>
    </Dialog>
  );
};
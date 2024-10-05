import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
} from "./dialog";
import { PropsWithChildren } from "react";

type DialogType = {
  title: string;
  setIsModalOpen: (open: boolean) => void;
  isModalOpen: boolean;
};

export const Modal = ({
  title,
  setIsModalOpen,
  isModalOpen,
  children,
}: PropsWithChildren<DialogType>) => {
  const [trigger, ...modalContent] = Array.isArray(children)
    ? children
    : [children];


  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogTitle hidden>{title}</DialogTitle>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent aria-describedby={undefined} className="w-fit min-w-96 max-h-[90vh] font-outfit">
          {modalContent}
        </DialogContent>
    </Dialog>
  );
};

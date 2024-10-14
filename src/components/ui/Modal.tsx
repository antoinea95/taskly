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
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent aria-describedby={undefined} className="w-fit min-w-96 max-h-[90vh] font-outfit dark:bg-gray-900 border-none">
          <DialogTitle hidden>{title}</DialogTitle>
          {modalContent}
        </DialogContent>
    </Dialog>
  );
};

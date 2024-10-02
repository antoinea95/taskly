import {
  Dialog,
  DialogTrigger,
  DialogContent,
} from "./dialog";
import { PropsWithChildren } from "react";

type DialogType = {
  title?: string;
  subtitle?: string;
  setIsModalOpen: (open: boolean) => void;
  isModalOpen: boolean;
};

export const Modal = ({
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
      <DialogContent aria-describedby={undefined} className="w-fit min-w-96 max-h-[90vh] font-outfit">
          {modalContent}
        </DialogContent>
    </Dialog>
  );
};

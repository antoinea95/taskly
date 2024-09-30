import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./dialog";
import { PropsWithChildren } from "react";

type DialogType = {
  title?: string;
  subtitle?: string;
  setIsModalOpen: (open: boolean) => void;
  isModalOpen: boolean;
};

export const Modal = ({
  title,
  subtitle,
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
          <DialogHeader>
              {title && <DialogTitle className="text-3xl font-normal">
                {title}
              </DialogTitle>}
              {subtitle && (
                <small className="text-sm rounded-lg px-2 py-1 bg-gray-100 w-fit font-medium text-gray-500">
                  {subtitle}
                </small>
              )}
          </DialogHeader>
          {modalContent}
        </DialogContent>
    </Dialog>
  );
};

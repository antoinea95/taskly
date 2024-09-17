import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { LucideIcon } from "lucide-react";
import {
  Dispatch,
  PropsWithChildren,
  ReactElement,
  SetStateAction,
} from "react";

type DialogType = {
  Trigger: ReactElement;
  Icon?: LucideIcon;
  dialogName: string | ReactElement;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
  isModalOpen: boolean;
};

export const Modal = ({
  Trigger,
  dialogName,
  setIsModalOpen,
  isModalOpen,
  children,
}: PropsWithChildren<DialogType>) => {


  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogTrigger asChild>
        {Trigger}
      </DialogTrigger>
      <DialogContent aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>{dialogName}</DialogTitle>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
};

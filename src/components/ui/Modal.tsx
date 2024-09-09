import { DialogType } from "@/utils/types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {useState } from "react";

export const Modal = ({triggerName, icon, dialogName, children}: DialogType) => {

  const [isModalOpen, setIsModalOpen] = useState(false);

  const Icon = icon;

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogTrigger asChild>
        <Button>
          <Icon size={16} className="mr-1"/>
          {triggerName}
          </Button>
      </DialogTrigger>
      <DialogContent aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>{dialogName}</DialogTitle>
        </DialogHeader>
        {children({ closeModal: () => setIsModalOpen(false) })}
      </DialogContent>
    </Dialog>
  );
};

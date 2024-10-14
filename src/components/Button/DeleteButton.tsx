import { useState } from "react";
import { Button } from "../ui/button";
import { Trash } from "lucide-react";
import { Modal } from "../ui/Modal";
import { DeleteButtonProps } from "../../utils/types/buttons.types";

/**
 * DeleteButton component
 *
 * This component renders a delete button that opens a modal when clicked. 
 * It can display custom content and children (such as confirmation buttons) passed as props.
 *
 * @param {Object} props - The props for the component.
 * @param {string} [props.content] - The content displayed inside the delete button (e.g., "Delete").
 * @param {Dispatch<SetStateAction<boolean>>} props.children - A render function that takes `setIsOpen` as a parameter, allowing control over the modal state.
 *
 * @returns A button that opens a modal, with optional content and children to handle the delete action.
 */
export const DeleteButton = ({
  content,
  children
}: DeleteButtonProps) => {

  const [isOpen, setIsOpen] = useState(false);

  return (
    <Modal
      title="Delete"
      isModalOpen={isOpen}
      setIsModalOpen={setIsOpen}
    >
      <Button
        className="rounded-xl flex gap-2 shadow-none hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-600"
        size={content ? "default" : "icon"}
        variant="secondary"
        onClick={() => setIsOpen(true)}
      >
        <Trash size={16} /> {content && content}
      </Button>
      {children({ setIsOpen })}
    </Modal>
  );
};

import { Button } from "../../ui/button";
import { Loader } from "../../ui/loader";
import { DeleteConfirmationProps } from "../../../utils/types/buttons.types";
import { ReAuthForm } from "@/components/Auth/ReAuthForm";
import { useState } from "react";

/**
 * DeleteConfirmation component
 *
 * A confirmation modal that prompts the user to confirm or cancel the deletion of an item.
 * It displays a message and provides two buttons: one for confirming the deletion and another for canceling it.
 *
 * @param {DeleteConfirmationProps} props - The properties for the DeleteConfirmation component.
 * @param {string} props.actionName - The name of the item being deleted (e.g., "task", "list", etc.).
 * @param {function} props.handleDelete - A function to execute the deletion when the user confirms.
 * @param {boolean} props.isPending - A boolean indicating if the delete action is in progress.
 * @param {function} props.setIsOpen - A function to close the confirmation modal (typically called with `false`).
 *
 * @returns The rendered confirmation modal.
 */
export const DeleteConfirmation = ({
  actionName,
  handleDelete,
  isPending,
  setIsOpen,
}: DeleteConfirmationProps) => {
  // State to ask user his password before deleting his account;
  const [isNeedPassword, setIsNeedPassword] = useState(
    actionName === "account"
  );

  return (
    <div className="flex flex-col gap-3 items-center font-bold p-3 pt-10">
      <p>
        {actionName === "account" && isNeedPassword
          ? "Please re-authenticate before:"
          : `Are you sure you want to delete this ${actionName}?`}
      </p>
      <div className="flex w-full m-auto items-center gap-10">
        {isNeedPassword ? (
          <ReAuthForm setIsNeedPassword={setIsNeedPassword} />
        ) : (
          <>
            {/* Confirmation button (Yes) */}
            <Button
              onClick={() => {
                handleDelete();
                if(!isPending) setIsOpen(false);
              }}
              className="rounded-xl border-none shadow-none w-full"
            >
              {isPending ? (
                <Loader data={{ color: "white", size: "1rem" }} />
              ) : (
                "Yes"
              )}
            </Button>
            {/* Cancel button (No) */}
            <Button
              onClick={() => setIsOpen(false)}
              className="bg-gray-100 rounded-xl text-black border-none shadow-none w-full hover:bg-gray-300"
            >
              No
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

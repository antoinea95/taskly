import { DeleteButton } from "@/components/Button/DeleteButton";
import { DeleteConfirmation } from "@/components/Form/actions/DeleteConfirmation";
import { NotificationBanner } from "@/components/Notification/NotificationBanner";
import { UseMutationResult } from "@tanstack/react-query";


/**
 * Return a delete button allow user to delete the files, a confirmation appears in a modal to confirm deletion
 * @param props
 * @param {() => Promise<void>} props.handleFileDelete - Function to handle the delete comes from useDeleteTaskFile hook
 * @param {UseMutationResult<void, Error, void, unknown>} props.deleteFileFromTask - Mutate object from react query
 */
export const DeleteFile = ({
  handleFileDelete,
  deleteFileFromTask,
}: {
  handleFileDelete: () => Promise<void>;
  deleteFileFromTask: UseMutationResult<void, Error, void, unknown>;
}) => {
  const { isPending, isError, error } = deleteFileFromTask;
  return (
    <DeleteButton>
      {({ setIsOpen }) => (
        <>
          <DeleteConfirmation handleDelete={handleFileDelete} actionName="file" isPending={isPending} setIsOpen={setIsOpen} />
          <NotificationBanner isError={isError} content={error?.message || ""} />
        </>
      )}
    </DeleteButton>
  );
};

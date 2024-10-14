import { Member } from "@/components/Members/Member";
import { UserType } from "@/utils/types/auth.types";
import { TaskCommentProps } from "@/utils/types/tasks.types";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetDoc } from "@/utils/hooks/FirestoreHooks/queries/useGetDoc";
import { FieldValues } from "react-hook-form";
import { useElapsedTime } from "@/utils/helpers/hooks/useElapsedtime";
import { DeleteButton } from "@/components/Button/DeleteButton";
import { DeleteConfirmation } from "@/components/Form/actions/DeleteConfirmation";
import { FormContainer } from "@/components/Form/containers/FormContainer";
import { z } from "zod";
import { FormFieldInputItem } from "@/components/Form/fields/FormFieldInputItem";
import { FormActionsButton } from "@/components/Form/actions/FormActionsButton";
import { Pen, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * TaskComment component displays a single comment within a task.
 * It allows the user who made the comment to update or delete it.
 *
 * @param {TaskCommentProps} props - The properties passed to the component.
 * @param {Object} props.comment - The comment object containing the comment's data.
 * @param {Array} props.comments - The array of all comments for the task.
 * @param {string} props.userId - The ID of the current user viewing the comment.
 * @param {MutationResultType<string, FieldValues>} props.mutationQuery - The mutation query used for updating or deleting comments.
 *
 * @returns The rendered TaskComment component.
 */
export const TaskComment = ({
  comment,
  comments,
  userId,
  mutationQuery,
}: TaskCommentProps) => {
  const [isCommentUpdate, setIsCommentUpdate] = useState(false);

  // Fetches user data based on the comment's userId
  const { data: user, isFetched } = useGetDoc<UserType>(
    "users",
    comment.userId
  );

  // Calculates the time elapsed since the comment was created
  const elpasedTime = useElapsedTime({ createdAt: comment.createdAt });

  // Validation schema for comment update
  const commentSchema = z.object({
    title: z.string().min(2),
  });

  /**
   * Finds the current comment from the comments array.
   *
   * @returns The found comment or undefined if not found.
   */
  const findComment = () => {
    return comments?.find(
      (item) => item.userId === userId && item.title === comment.title
    );
  };

  /**
   * Handles updating the comment's title.
   *
   * @param {FieldValues} data - The new data for the comment.
   */
  const handleUpdateComment = async (data: FieldValues) => {
    const commentToUpdate = findComment();

    if (commentToUpdate) {
      commentToUpdate.title = data.title;
      commentToUpdate.createdAt = Date.now();

      mutationQuery.mutate(
        {
          comments: comments?.map((item) =>
            item === commentToUpdate ? commentToUpdate : item
          ),
        },
        {
          onSuccess: () => setIsCommentUpdate(false),
        }
      );
    }
  };

  /**
   * Handles deleting the comment.
   *
   */
  const handleDeleteComment = async () => {
    const commentToDelete = findComment();
    mutationQuery.mutate(
      {
        comments: comments?.filter((item) => item !== commentToDelete),
      },
    );
  };

  return (
    <div className="flex flex-col space-y-3 p-3 bg-gray-50 rounded-xl dark:bg-gray-800 dark:border dark:border-gray-600">
      <div className="flex items-center gap-2">
        {/* Display the avatar of the comment's author */}
        <Member userId={comment.userId} type="avatar" />

        {/* Display the user's name and the time since the comment was created */}
        <p className="text-xs text-gray-500">
          {!isFetched ? <Skeleton className="w-44 h-5" /> : user && user.name}
          <span>{elpasedTime}</span>
        </p>

        {/* Display buttons to update or delete the comment if the user is the author */}
        {comment.userId === userId && !isCommentUpdate && (
          <div className="flex items-center justify-end flex-1 gap-2">
            <Button
              onClick={() => setIsCommentUpdate(true)}
              className="shadow-none rounded-xl hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-600"
              size="icon"
              variant="secondary"
            >
              <Pen size={16} />
            </Button>
            <DeleteButton>
              {({ setIsOpen }) => (
                <DeleteConfirmation
                  handleDelete={handleDeleteComment}
                  isPending={mutationQuery.isPending}
                  actionName="comment"
                  setIsOpen={setIsOpen}
                />
              )}
            </DeleteButton>
          </div>
        )}
      </div>

      {/* Display the comment's content or the form to update the comment */}
      {!isCommentUpdate ? (
        <p className="p-2 w-full text-sm">
          {comment.title}
        </p>
      ) : (
        <FormContainer
          schema={commentSchema}
          mutationQuery={mutationQuery}
          onSubmit={handleUpdateComment}
          defaultValues={{ title: comment.title }}
        >
          {({ form }) => (
            <>
              <FormFieldInputItem
                form={form}
                item={{
                  name: "title",
                  type: "text",
                  placeholder: "Your comment",
                }}
              />
              <FormActionsButton
                isPending={mutationQuery.isPending}
                setIsOpen={setIsCommentUpdate}
                disabled={
                  mutationQuery.isPending ||
                  Object.keys(form.getValues()).length === 0
                }
              >
                <span className="flex items-center gap-2">
                  <Plus size={16} />
                  Update comment
                </span>
              </FormActionsButton>
            </>
          )}
        </FormContainer>
      )}
    </div>
  );
};

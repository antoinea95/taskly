import { MessageSquare } from "lucide-react";
import { TaskComment } from "./TaskComment";
import { TaskCommentsSectionProps } from "@/utils/types/tasks.types";
import { FieldValues } from "react-hook-form";
import { AddForm } from "@/components/Form/AddForm";
import { useState } from "react";

/**
 * TaskCommentsSection component renders the section for task comments, allowing users to add and view comments.
 *
 * @param {TaskCommentsSectionProps} props - The properties passed to the component.
 * @param {Array} props.comments - An array of comments related to the task.
 * @param {string} props.userId - The ID of the user who is adding or interacting with comments.
 * @param {Object} props.mutationQuery - The mutation query object used to update the comments in Firestore.
 *
 * @returns The TaskCommentsSection component.
 */
export const TaskCommentsSection = ({
  comments,
  userId,
  mutationQuery,
}: TaskCommentsSectionProps) => {
  const [isAddComment, setIsAddComment] = useState(false);

  /**
   * Handles the submission of a new comment.
   *
   * @param {FieldValues} data - The form data, containing the new comment title.
   */
  const handleAddNewComment = async (data: FieldValues) => {
    const newComment = {
      title: data.title,
      createdAt: Date.now(),
      userId: userId,
    };

    // Mutate the comments array to add a new comment
    mutationQuery.mutate(
      {
        comments: comments ? [...comments, newComment] : [newComment],
      },
      {
        onSuccess: () => setIsAddComment(false),
      }
    );
  };

  return (
    <div className="md:px-10 space-y-1 mb-10 mt-3">
      <div className="relative min-h-10 mb-3 flex flex-col">
        <h3 className="flex items-center gap-2 font-medium my-2 justify-self-center">
          <MessageSquare size={20} />
          Comments
        </h3>
        {/* Form for adding a new comment */}
        <AddForm
          name="comment"
          mutationQuery={mutationQuery}
          onSubmit={handleAddNewComment}
          isOpen={isAddComment}
          setIsOpen={setIsAddComment}
        />
      </div>
      <div className="space-y-3">
        {/* Display the list of comments */}
        {comments && comments.length > 0 ? (
          comments.sort((a,b) => b.createdAt - a.createdAt).map((comment, index) => (
            <TaskComment
              key={index}
              comments={comments}
              comment={comment}
              userId={userId}
              mutationQuery={mutationQuery}
            />
          ))
        ) : (
          <p className="rounded-xl bg-gray-50 h-16 flex items-center justify-center uppercase font-light text-gray-300 text-sm dark:bg-gray-800 dark:text-gray-600">
            No comments yet
          </p>
        )}
      </div>
    </div>
  );
};

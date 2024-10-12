import { MessageSquare } from "lucide-react";
import { TaskComment } from "./TaskComment";
import { TaskCommentsSectionProps } from "@/utils/types/tasks.types";
import { FieldValues } from "react-hook-form";
import { AddForm } from "@/components/Form/AddForm";

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
    mutationQuery.mutate({
      comments: comments ? [...comments, newComment] : [newComment],
    });
  };

  return (
    <div className="col-span-5 px-3 space-y-1">
      <h3 className="flex items-center gap-2 font-medium">
        <MessageSquare size={20} />
        Comments
      </h3>
      <div className="space-y-3 bg-gray-50 p-3 rounded-xl">
        {/* Form for adding a new comment */}
        <AddForm
          name="comment"
          mutationQuery={mutationQuery}
          onSubmit={handleAddNewComment}
        />

        {/* Display the list of comments */}
        {comments &&
          comments.map((comment, index) => (
            <TaskComment
              key={index}
              comments={comments}
              comment={comment}
              userId={userId}
              mutationQuery={mutationQuery}
            />
          ))}
      </div>
    </div>
  );
};

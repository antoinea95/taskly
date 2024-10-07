import { TaskCommentType, TaskType } from "@/utils/types";
import { MessageSquare } from "lucide-react";
import { TaskComment } from "./TaskComment";
import { AddItem } from "@/components/Form/AddItem";
import { UseMutationResult } from "@tanstack/react-query";

export const TaskCommentsSection = ({
  comments,
  userId,
  query,
}: {
  query: UseMutationResult<any, unknown, Partial<TaskType>>;
  userId: string;
  comments?: TaskCommentType[];
}) => {

  const onSubmit = async (data: { title: string }) => {
    const newComment = {
      title: data.title,
      createdAt: Date.now(),
      userId: userId,
    };
    query.mutate({
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
        <AddItem type="Comment" query={query} onSubmit={onSubmit} />
        {comments &&
          comments.map((comment, index) => (
            <TaskComment key={index} comments={comments} comment={comment} userId={userId} query={query} />
          ))}
      </div>
    </div>
  );
};

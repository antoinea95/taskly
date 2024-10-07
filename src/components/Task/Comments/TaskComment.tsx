import { AddItem } from "@/components/Form/AddItem";
import { DeleteItem } from "@/components/Form/DeleteItem";
import { Member } from "@/components/Members/Member";
import { useGetDoc } from "@/firebase/fetchHook";
import { TaskCommentType, TaskType, UserType } from "@/utils/types";
import { UseMutationResult } from "@tanstack/react-query";
import { useState } from "react";
import { ElapsedTime } from "./ElapsedTime";
import { Skeleton } from "@/components/ui/skeleton";

export const TaskComment = ({
  comment,
  comments,
  userId,
  query,
}: {
  comment: TaskCommentType;
  comments: TaskCommentType[];
  userId: string;
  query: UseMutationResult<any, unknown, Partial<TaskType>>;
}) => {
  const { data: user, isFetched } = useGetDoc<UserType>(
    "users",
    comment.userId
  );

  const [isCommentUpdate, setIsCommentUpdate] = useState(false);

  const findComment = () => {

    return comments.find(
        (item) => item.userId === userId && item.title === comment.title
    );
  }

  const handleUpdateComment = async (data: { title: string }) => {
    const commentToUpdate = findComment();

    if (commentToUpdate) {
        commentToUpdate.title = data.title;
        commentToUpdate.createdAt = Date.now();

        query.mutate({
            comments: comments.map((item) =>
                item === commentToUpdate ? commentToUpdate : item
            )
        }, {
            onSuccess: () => setIsCommentUpdate(false)
        });
    }
};

const handleDeleteComment = async () => {
    const commentToDelete = findComment();
    query.mutate({
        comments: comments.filter((item) =>
            item !== commentToDelete
        )
    }, {
        onSuccess: () => setIsCommentUpdate(false)
    });
}

  return (
    <div className="flex flex-col space-y-2 bg-white rounded-xl p-3">
      <div className="flex items-center gap-2">
        <Member userId={comment.userId} type="avatar" />
         <p className="text-xs text-gray-500">
          {!isFetched ? <Skeleton className="w-44 h-5" /> : user && user.name}
          <ElapsedTime createdAt={comment.createdAt} />
        </p>
        {comment.userId === userId && !isCommentUpdate && (
        <div className="flex items-center justify-end flex-1 gap-2">
          <button onClick={() => setIsCommentUpdate(true)} className="bg-gray-100 rounded-xl text-xs px-3 h-8 text-gray-500 hover:bg-gray-200">Update</button>
          <DeleteItem name="comment" isText={true} handleDelete={handleDeleteComment} isPending={query.isPending}/>
        </div>
      )}
      </div>
      {!isCommentUpdate ? (
        <p className="p-2 w-full text-sm bg-gray-50 rounded-xl">
          {comment.title}
        </p>
      ) : (
        <AddItem query={query} onSubmit={handleUpdateComment} type="Comment" value={comment.title} isOpen={isCommentUpdate} setIsOpen={setIsCommentUpdate} />
      )}
    </div>
  );
};

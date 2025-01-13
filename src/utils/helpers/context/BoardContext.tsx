import { useGetLists } from "@/utils/hooks/FirestoreHooks/queries/useGetLists";
import { useGetTasks } from "@/utils/hooks/FirestoreHooks/queries/useGetTasks";
import { ListType } from "@/utils/types/lists.types";
import { TaskTagType, TaskType } from "@/utils/types/tasks.types";
import { createContext, PropsWithChildren, useMemo } from "react";

export const BoardContext = createContext<{
  listsInBoard: ListType[] | null;
  tasksInBoard: TaskType[] | null;
  uniqueTagsFromTasks: TaskTagType[];
  listIds: string[];
  boardId: string;
} | null>(null);

export const BoardContextProvider = ({ boardId, children }: PropsWithChildren<{ boardId: string }>) => {


  // fetch lists
  const listsInBoard = useGetLists(boardId);


  // Get lists
  const taskIds = useMemo(() => {
    if (!listsInBoard.data) return [];
    const taskIds = listsInBoard.data.flatMap((list) => list.tasks);
    return taskIds ? taskIds : [];
  }, [listsInBoard]);

  const tasksInBoard = useGetTasks(taskIds.length > 0, taskIds);

  const listIds = useMemo(() => {
    if (!listsInBoard.data) return [];
    return listsInBoard.data.map((list) => list.id);
  }, [listsInBoard.data]);

  const uniqueTagsFromTasks = useMemo(() => {
    if (!tasksInBoard.data || taskIds.length === 0) return [];

    const uniqueTags = tasksInBoard.data.reduce(
      (acc, task) => {
        task.labels?.forEach((label) => {
          if (!acc[label.title]) {
            acc[label.title] = label.color;
          }
        });
        return acc;
      },
      {} as Record<string, string>
    );

    return Object.keys(uniqueTags).map((label) => ({
      title: label,
      color: uniqueTags[label],
    }));
  }, [tasksInBoard.data, taskIds]);

  // Fetch tasks based on task Ids, enabled only when taskIdsInLists is defined
  const isLoading = listsInBoard.isLoading || tasksInBoard.isLoading;
  const isError = listsInBoard.isError || tasksInBoard.isError;

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (isError) {
    console.log(tasksInBoard.error);
    return <p>An error occurred. Please try again later.</p>;
  }

  const value = {
    listsInBoard: listsInBoard.data ?? null,
    tasksInBoard: tasksInBoard.data ?? null,
    uniqueTagsFromTasks,
    listIds,
    boardId,
  };

  return <BoardContext.Provider value={value}>{children}</BoardContext.Provider>;
};

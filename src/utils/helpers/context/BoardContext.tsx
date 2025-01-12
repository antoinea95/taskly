import { useGetLists } from "@/utils/hooks/FirestoreHooks/queries/useGetLists";
import { useGetTasks } from "@/utils/hooks/FirestoreHooks/queries/useGetTasks";
import { ListType } from "@/utils/types/lists.types";
import { TaskType } from "@/utils/types/tasks.types";
import { createContext, PropsWithChildren, useMemo } from "react";

export const BoardContext = createContext<{
  listsInBoard: ListType[] | null;
  tasksInBoard: TaskType[] | null;
  listIds: string[];
  boardId: string;
} | null>(null);

export const BoardContextProvider = ({ boardId, children }: PropsWithChildren<{ boardId: string }>) => {
  // fetch lists
  const listsInBoard = useGetLists(boardId);
  const tasksInBoard = useGetTasks(!!listsInBoard.data, listsInBoard.data?.flatMap((list) => list.tasks) ?? []);

  const listIds = useMemo(() => {
    if (!listsInBoard.data) return [];
    return listsInBoard.data.map((list) => list.id);
  }, [listsInBoard.data]);


  // Fetch tasks based on task Ids, enabled only when taskIdsInLists is defined
  const isLoading = listsInBoard.isLoading || tasksInBoard.isLoading;
  const isError = listsInBoard.isError || tasksInBoard.isError;

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if(isError) {
    return <p>An error occurred. Please try again later.</p>
  }

  const value = {
    listsInBoard: listsInBoard.data ?? null,
    tasksInBoard: tasksInBoard.data ?? null,
    listIds,
    boardId
  };

  return <BoardContext.Provider value={value}>{children}</BoardContext.Provider>;
};

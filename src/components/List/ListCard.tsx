import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { useMemo, useState } from "react";
import { ListType} from "@/components/types/lists.types";
import { TaskType } from "../types/tasks.types";
import { useDroppable } from "@dnd-kit/core";
import { TaskCard } from "../Task/Card/TaskCard";
import { useAddDoc } from "@/utils/hooks/FirestoreHooks/mutations/useAddDoc";
import { useUpdateDoc } from "@/utils/hooks/FirestoreHooks/mutations/useUpdateDoc";
import { useDeleteList } from "@/utils/hooks/FirestoreHooks/mutations/useDeletions";
import { FieldValues } from "react-hook-form";
import { UpdateTitleForm } from "../Form/UpdateTitleForm";
import { DeleteButton } from "../Button/DeleteButton";
import { DeleteConfirmation } from "../Form/actions/DeleteConfirmation";
import { AddForm } from "../Form/AddForm";

/**
 * `ListCard` component renders a card that displays a list's title and tasks.
 * It allows updating the title, adding new tasks, and deleting the list.
 *
 * @param {Object} props - The props for the ListCard component.
 * @param {ListType} props.list - The list object that contains the list's details and tasks.
 * @param {string} props.boardId - The ID of the board that the list belongs to.
 * 
 * @returns The rendered ListCard component.
 */
export const ListCard = ({
  list,
  boardId,
}: {
  list: ListType;
  boardId: string;
}) => {
  const [isAddTask, setIsAddTask] = useState(false);
  const { setNodeRef } = useDroppable({ id: list.id, data: { type: "list" } });

  /**
   * Memoized task cards, created from the list's task IDs.
   * This is used to optimize re-renders when the list changes.
   */
  const memoizedTasks = useMemo(() => {
    return list?.tasks.map((taskId) => (
      <TaskCard key={taskId} taskId={taskId} list={list} />
    ));
  }, [list]);

  const createTask = useAddDoc<TaskType>(["tasks", list.id], "tasks");
  const updateList = useUpdateDoc<Partial<ListType>>(
    ["lists", boardId],
    "lists",
    list.id
  );
  const deleteList = useDeleteList<void>(boardId, list.id);

  /**
   * Handles the creation of a new task when the form is submitted.
   * 
   * @param {FieldValues} data - The data submitted from the task form.
   */
  const handleCreateTask = async (data: FieldValues) => {
    createTask.mutate(
      {
        title: data.title,
        createdAt: Date.now(),
      },
      {
        onSuccess: (newTaskId) => {
          updateList.mutate({
            tasks: [...list.tasks, newTaskId],
          });
          setIsAddTask(false);
        },
      }
    );
  };

  /**
   * Handles deleting the current list.
   */
  const handleDeleteList = async () => {
    deleteList.mutate();
  };

  return (
    <div ref={setNodeRef} className="h-fit min-w-72 w-fit px-3">
      {list && (
        <Card className="shadow-none h-fit bg-transparent min-h-96 border-none">
          <CardHeader className="p-0 flex flex-col gap-3">
            <CardTitle className="text-xl font-normal flex items-center justify-between">
              <UpdateTitleForm
                name="List"
                title={list.title}
                mutationQuery={updateList}
                headingLevel={"h3"}
              />
              <DeleteButton>
                {({ setIsOpen }) => (
                  <DeleteConfirmation
                    actionName="list"
                    handleDelete={handleDeleteList}
                    isPending={deleteList.isPending}
                    setIsOpen={setIsOpen}
                  />
                )}
              </DeleteButton>
            </CardTitle>
            <AddForm
              name="Task"
              onSubmit={handleCreateTask}
              mutationQuery={createTask}
              isOpen={isAddTask}
              setIsOpen={setIsAddTask}
            />
          </CardHeader>
          <CardContent className="flex flex-col gap-3 pt-3 px-0">
            {memoizedTasks}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

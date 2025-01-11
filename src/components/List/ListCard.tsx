import { useMemo, useState } from "react";
import { ListType } from "@/utils/types/lists.types";
import { TaskType } from "../../utils/types/tasks.types";
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
  tasks
}: {
  list: ListType;
  boardId: string;
  tasks: TaskType[]
}) => {
  const [isAddTask, setIsAddTask] = useState(false);
  const { setNodeRef } = useDroppable({ id: list.id, data: { type: "list" } });

  const sortedTask = useMemo(() => tasks.sort((a,b) => {
    const indexA = list.tasks.indexOf(a.id);
    const indexB = list.tasks.indexOf(b.id);
    return indexA - indexB
  }), [list, tasks]);

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
    <div ref={setNodeRef} className="w-fit md:min-w-96 min-w-72 mb-2 rounded-xl">
      {list && (
        <section className="md:min-w-96 w-fit min-w-72 p-3 rounded-xl bg-gray-50 space-y-3 dark:bg-gray-900">
          <header className="space-y-3">
            <div className="flex justify-between items-center">
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
            </div>

            <AddForm
              name="Task"
              onSubmit={handleCreateTask}
              mutationQuery={createTask}
              isOpen={isAddTask}
              setIsOpen={setIsAddTask}
            />
          </header>
          <section className="space-y-3"> {sortedTask.map((task) => (
              <TaskCard key={task.id} taskId={task.id} task={task} list={list} />
            ))}</section>
        </section>
      )}
    </div>
  );
};

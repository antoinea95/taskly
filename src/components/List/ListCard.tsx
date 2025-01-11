import { useMemo, useState } from "react";
import { ListType } from "@/utils/types/lists.types";
import { TaskType } from "../../utils/types/tasks.types";
import { TaskCard } from "../Task/Card/TaskCard";
import { useAddDoc } from "@/utils/hooks/FirestoreHooks/mutations/useAddDoc";
import { useUpdateDoc } from "@/utils/hooks/FirestoreHooks/mutations/useUpdateDoc";
import { useDeleteList } from "@/utils/hooks/FirestoreHooks/mutations/useDeletions";
import { FieldValues } from "react-hook-form";
import { UpdateTitleForm } from "../Form/UpdateTitleForm";
import { DeleteButton } from "../Button/DeleteButton";
import { DeleteConfirmation } from "../Form/actions/DeleteConfirmation";
import { AddForm } from "../Form/AddForm";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { DroppableContainer } from "../DragAndDrop/DroppableContainer";

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
export const ListCard = ({ list, boardId }: { list: ListType; boardId: string }) => {
  const [isAddTask, setIsAddTask] = useState(false);
  /**
   * Memoized task cards, created from the list's task IDs.
   * This is used to optimize re-renders when the list changes.
   */
  const memoizedTasks = useMemo(() => {
    return list && list.tasks.map((taskId) => <TaskCard key={taskId} taskId={taskId} list={list} />);
  }, [list]);

  const createTask = useAddDoc<TaskType>(["tasks", list.id], "tasks");
  const updateList = useUpdateDoc<Partial<ListType>>(["lists", boardId], "lists", list.id);
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
    <SortableContext key={list.id} items={list.tasks} id={list.id} strategy={verticalListSortingStrategy}>
      <DroppableContainer id={list.id} type="list">
        <div className="w-fit md:min-w-96 min-w-72 mb-2 rounded-xl animate-top-to-bottom flex-shrink-0">
          {list && (
            <section className="md:min-w-96 w-fit min-w-72 p-3 rounded-xl bg-gray-50 space-y-3 dark:bg-gray-900">
              <header className="space-y-3">
                <div className="flex justify-between items-center">
                  <UpdateTitleForm name="List" title={list.title} mutationQuery={updateList} headingLevel={"h3"} />
                  <DeleteButton>
                    {({ setIsOpen }) => (
                      <DeleteConfirmation actionName="list" handleDelete={handleDeleteList} isPending={deleteList.isPending} setIsOpen={setIsOpen} />
                    )}
                  </DeleteButton>
                </div>
                <AddForm name="Task" onSubmit={handleCreateTask} mutationQuery={createTask} isOpen={isAddTask} setIsOpen={setIsAddTask} />
              </header>
              <section className="space-y-3">{memoizedTasks}</section>
            </section>
          )}
        </div>
      </DroppableContainer>
    </SortableContext>
  );
};

import { Dispatch, SetStateAction, useState } from "react";
import { ScrollArea } from "../../ui/scroll-area";
import { useParams } from "react-router-dom";
import { List, Tag, Users } from "lucide-react";
import { MembersDetails } from "@/components/Members/MembersDetails";
import { TaskCheckListSection } from "../CheckList/TaskCheckListSection";
import { TaskCommentsSection } from "../Comments/TaskCommentsSection";
import { AddLabel } from "../Label/AddLabel";
import { TaskHeaderItem } from "../Containers/TaskHeaderItem";
import { CheckListType, TaskType } from "@/utils/types/tasks.types";
import { ListType } from "@/utils/types/lists.types";
import { useAuth } from "@/utils/hooks/FirestoreHooks/auth/useAuth";
import { useGetDoc } from "@/utils/hooks/FirestoreHooks/queries/useGetDoc";
import { BoardType } from "@/utils/types/boards.types";
import { useDeleteTask } from "@/utils/hooks/FirestoreHooks/mutations/useDeletions";
import { useUpdateDoc } from "@/utils/hooks/FirestoreHooks/mutations/useUpdateDoc";
import { useAddDoc } from "@/utils/hooks/FirestoreHooks/mutations/useAddDoc";
import { FieldValues } from "react-hook-form";
import { UpdateTitleForm } from "@/components/Form/UpdateTitleForm";
import { TaskDeadline } from "../Deadline/TaskDeadline";
import { TaskLabel } from "../Label/TaskLabel";
import { TaskDescription } from "../Description/TaskDescription";
import { AddTaskDeadline } from "../Deadline/AddTaskDeadline";
import { AddForm } from "@/components/Form/AddForm";
import { DeleteButton } from "@/components/Button/DeleteButton";
import { DeleteConfirmation } from "@/components/Form/actions/DeleteConfirmation";
import { AddFileInTask } from "../Files/AddFileInTask";
import { TaskFiles } from "../Files/TaskFiles";
import { AddMemberToTask } from "@/components/Members/AddMemberToTask";

/**
 * Component to display the details of a task, including the ability to update or delete the task,
 * add labels, deadlines, members, and manage checklists.
 *
 * @param {Object} props - Component props.
 * @param {TaskType} props.task - The task object containing all task details.
 * @param {Dispatch<SetStateAction<boolean>>} props.setIsTaskOpen - Function to control the state of task visibility.
 * @param {ListType} props.list - The list to which the task belongs.
 * @returns The TaskDetails component.
 */
export const TaskDetails = ({ task, setIsTaskOpen, list }: { task: TaskType; setIsTaskOpen: Dispatch<SetStateAction<boolean>>; list: ListType }) => {
  const { currentUser } = useAuth();
  const { boardId } = useParams();
  const [isAddCheckList, setIsAddCheckList] = useState(false);

  // fetch data
  const board = useGetDoc<BoardType>("boards", boardId);

  // mutate hooks
  const addCheckList = useAddDoc<CheckListType>(["checklists", task.id], `tasks/${task.id}/checklists`);
  const deleteTask = useDeleteTask<void>(task.id);
  const updateList = useUpdateDoc<Partial<ListType>>(["lists", boardId], "lists", list.id);
  const updateTask = useUpdateDoc<Partial<TaskType>>(["tasks"], "tasks", task.id);

  /**
   * Handles adding a new checklist to the task.
   *
   * @param {FieldValues} data - The data submitted from the form, including the title of the checklist.
   */
  const handleAddChecklist = async (data: FieldValues) => {
    addCheckList.mutate(
      {
        title: data.title,
        createdAt: Date.now(),
      },
      {
        onSuccess: () => setIsAddCheckList(false),
      }
    );
  };

  /**
   * Handles the deletion of the task.
   * It removes the task from the list and updates the Firestore document.
   */
  const handleDeleteTask = async () => {
    await deleteTask.mutateAsync();
    await updateList.mutateAsync({
      tasks: list.tasks.filter((taskId) => taskId !== task.id),
    });

    setIsTaskOpen(false);
  };

  return (
    <ScrollArea className=" h-[95dvh] md:max-h-[700px] max-w-[850px] w-[90vw] border-2 border-white m-0 p-3 bg-white dark:bg-gray-900 dark:border-gray-900 dark:text-gray-300">
      <header className="sticky top-0 z-10 bg-white dark:bg-gray-900 dark:border-gray-900 space-y-2 p-3 md:p-6 animate-top-to-bottom">
        <div className="flex justify-between items-center flex-wrap">
          <UpdateTitleForm name="Task" title={task.title} mutationQuery={updateTask} headingLevel={"h2"} />
          <DeleteButton content="Delete task">
            {({ setIsOpen }) => (
              <DeleteConfirmation handleDelete={handleDeleteTask} actionName="task" isPending={deleteTask.isPending} setIsOpen={setIsOpen} />
            )}
          </DeleteButton>
        </div>
        <section className="flex items-start gap-3 md:gap-2 flex-wrap">
          <TaskHeaderItem title="List" icon={List}>
            <span className="text-sm font-medium">{list.title}</span>
          </TaskHeaderItem>
          {task.dueDate && <TaskDeadline dueDate={task.dueDate} taskId={task.id} />}
          {task.members && task.members.length > 0 && board.data && (
            <TaskHeaderItem title="Members" icon={Users}>
              <MembersDetails members={task.members} mutationQuery={updateTask} />
            </TaskHeaderItem>
          )}
          {task.labels && task.labels.length > 0 && (
            <TaskHeaderItem title="Labels" icon={Tag}>
              {task.labels.map((label, index) => (
                <TaskLabel key={index} label={label} labels={task.labels} mutationQuery={updateTask} />
              ))}
            </TaskHeaderItem>
          )}
        </section>
      </header>
      <section className="flex flex-col-reverse md:flex-row md:flex-nowrap items-start justify-between flex-wrap md:px-10 gap-5 py-3 animate-top-to-bottom delay-75">
        <div className="flex flex-col gap-3 h-fit md:w-3/5 w-full">
          <TaskDescription mutationQuery={updateTask} description={task.description} />
          {task.files && <TaskFiles taskId={task.id} files={task.files} />}
          <TaskCheckListSection taskId={task.id} />
        </div>
        <div className="md:sticky md:top-48 right-0 md:w-2/5 ml-auto h-fit w-full">
          <div className="rounded-xl w-full flex flex-col gap-3">
            <AddLabel labels={task.labels} mutationQuery={updateTask} />
            {board.data && (
              <AddMemberToTask queryKey={["tasks"]} taskMembers={task.members ? task.members : []} members={board.data.members ? board.data.members : []} mutationQuery={updateTask} board={board.data} />
            )}
            <AddTaskDeadline task={task} mutationQuery={updateTask} />
            <AddForm
              name="Checklist"
              onSubmit={handleAddChecklist}
              mutationQuery={addCheckList}
              isOpen={isAddCheckList}
              setIsOpen={setIsAddCheckList}
            />
            <AddFileInTask taskId={task.id} files={task.files} />
          </div>
        </div>
      </section>

      {currentUser && <TaskCommentsSection comments={task.comments} mutationQuery={updateTask} userId={currentUser.id} />}
    </ScrollArea>
  );
};

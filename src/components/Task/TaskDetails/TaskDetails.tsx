import { Dispatch, SetStateAction, useState } from "react";
import { ScrollArea } from "../../ui/scroll-area";
import { useParams } from "react-router-dom";
import { AddMember } from "../../Members/AddMember";
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
export const TaskDetails = ({
  task,
  setIsTaskOpen,
  list,
}: {
  task: TaskType;
  setIsTaskOpen: Dispatch<SetStateAction<boolean>>;
  list: ListType;
}) => {
  const { currentUser } = useAuth();
  const { boardId } = useParams();
  const [isAddCheckList, setIsAddCheckList] = useState(false);

  // fetch data
  const board = useGetDoc<BoardType>("boards", boardId);

  // mutate hooks
  const addCheckList = useAddDoc<CheckListType>(
    ["checklists", task.id],
    `tasks/${task.id}/checklists`
  );
  const deleteTask = useDeleteTask<void>(task.id);
  const updateList = useUpdateDoc<Partial<ListType>>(
    ["lists", boardId],
    "lists",
    list.id
  );
  const updateTask = useUpdateDoc<Partial<TaskType>>(
    ["task", task.id],
    "tasks",
    task.id
  );

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
    <ScrollArea className="w-[850px] h-[80vh]">
      <header className="mb-3 flex justify-between items-center p-3 pt-6">
        <UpdateTitleForm
          name="Task"
          title={task.title}
          mutationQuery={updateTask}
          headingLevel={"h2"}
        />
        <DeleteButton content="Delete task">
          {({ setIsOpen }) => (
            <DeleteConfirmation
              handleDelete={handleDeleteTask}
              actionName="task"
              isPending={deleteTask.isPending}
              setIsOpen={setIsOpen}
            />
          )}
        </DeleteButton>
      </header>
      <section className="flex items-start my-2 gap-2 px-3">
        <TaskHeaderItem title="List" icon={List}>
          <span className="text-sm font-medium">{list.title}</span>
        </TaskHeaderItem>
        {task.dueDate && (
          <TaskDeadline dueDate={task.dueDate} taskId={task.id} />
        )}
        {task.members && task.members.length > 0 && board.data && (
          <TaskHeaderItem title="Members" icon={Users}>
            <MembersDetails members={task.members} mutationQuery={updateTask} />
          </TaskHeaderItem>
        )}
        {task.labels && task.labels.length > 0 && (
          <TaskHeaderItem title="Labels" icon={Tag}>
            {task.labels.map((label, index) => (
              <TaskLabel
                key={index}
                label={label}
                labels={task.labels}
                mutationQuery={updateTask}
              />
            ))}
          </TaskHeaderItem>
        )}
      </section>
      <section className="grid grid-cols-5 grid-rows-1 gap-5 px-4 py-6">
        <div className="flex flex-col gap-3 col-span-3 px-3 h-fit">
          <TaskDescription
            mutationQuery={updateTask}
            description={task.description}
          />
          <TaskCheckListSection taskId={task.id} />
        </div>
        <div className="h-fit col-span-2 relative">
          <div className="rounded-xl w-full sticky top-0 right-0 flex flex-col gap-3">
            <AddLabel labels={task.labels} mutationQuery={updateTask} />
            {board.data && (
              <AddMember
                queryKey={["tasks", task.id]}
                members={task.members ? task.members : []}
                mutationQuery={updateTask}
                board={board.data}
              />
            )}
            <AddTaskDeadline task={task} mutationQuery={updateTask} />
            <AddForm
              name="Checklist"
              onSubmit={handleAddChecklist}
              mutationQuery={addCheckList}
              isOpen={isAddCheckList}
              setIsOpen={setIsAddCheckList}
            />
          </div>
        </div>
      </section>
      {currentUser && (
          <TaskCommentsSection
            comments={task.comments}
            mutationQuery={updateTask}
            userId={currentUser.id}
          />
        )}
    </ScrollArea>
  );
};

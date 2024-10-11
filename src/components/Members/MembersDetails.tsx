import { Member } from "./Member";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../ui/hover-card";
import { MembersAvatarList } from "./MembersAvatarList";
import { useQueryClient } from "@tanstack/react-query";
import { TaskType } from "@/components/types/tasks.types";
import { query as queryFirebase, where } from "firebase/firestore";
import { MembersDetailsProps } from "../types/members.type";
import { FirestoreService } from "@/utils/firebase/firestore/firestoreService";

/**
 * MembersDetails component
 *
 * This component displays the members of a board or task in a hoverable card.
 * It allows the deletion of members and automatically updates associated tasks
 * in the Firestore collection if a member is removed.
 *
 * @template T - The type of the mutation query payload.
 * @param {MembersDetailsProps<T>} props - The props for the MembersDetails component.
 * @param props.members - Array of member IDs to be displayed.
 * @param props.creator - The creator's user ID.
 * @param props.mutationQuery - The mutation query function to update members.
 * @param props.isBoard - Boolean indicating if it's a board or task view.
 * @returns A HoverCard component displaying the member list.
 */
export const MembersDetails = <T,>({
  members,
  creator,
  mutationQuery,
  isBoard
}: MembersDetailsProps<T>) => {

  const queryClient = useQueryClient();

  /**
   * Handles the deletion of a member.
   *
   * This function updates the list of members in the associated board/task
   * and removes the member from any related tasks.
   *
   * @param {string} id - The ID of the member to be deleted.
   * @throws Will throw an error if the member cannot be deleted.
   */
  const handleDeleteMember = async (id: string) => {
    try {
      // Update the members array by removing the deleted member
      await mutationQuery.mutateAsync(
        {
          members: members.filter((member) => member !== id)
        } as T
      );
  
      if (isBoard) {
        // Fetch all tasks that include the deleted member
        const tasks: TaskType[] = await FirestoreService.fetchDocs(
          "tasks",
          (colRef) => {
            return queryFirebase(colRef, where("members", "array-contains", id));
          },
        );
  
        // Update each task to remove the member from the task
        await Promise.all(
          tasks.map(async (task: TaskType) => {
            const updatedMembers = task.members ? task.members.filter((member) => member !== id) : [];
  
            await FirestoreService.updateDocument<TaskType>("tasks", {
              members: updatedMembers, // Update the task members array
            }, task.id);
  
            queryClient.invalidateQueries({ queryKey: ["tasks", task.id] }); // Invalidate the query to refetch updated data
          })
        );
      }
    } catch (error) {
      console.error("Error deleting member:", error); // Log the error for debugging
      throw new Error("Failed to delete member"); // Throw an error if the deletion fails
    }
  };

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <div className="flex items-center">
          <MembersAvatarList members={members}>
            {members.slice(0, 5).map((member) => (
              <Member key={member} userId={member} type="avatar" />
            ))}
          </MembersAvatarList>
        </div>
      </HoverCardTrigger>
      <HoverCardContent className="mr-8 rounded-xl shadow-none w-fit">
        <div className="space-y-5 min-w-72">
          {members.map((member) => (
            <Member
              key={member}
              userId={member}
              type="list"
              creator={creator}
              handleDeleteMember={handleDeleteMember}
              isTaskView={!isBoard}
            />
          ))}
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};

import { Member } from "./Member";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../ui/hover-card";
import { MembersAvatarList } from "./MembersAvatarList";
import { UseMutationResult, useQueryClient } from "@tanstack/react-query";
import { BoardType, TaskType } from "@/utils/types";
import FirestoreApi from "@/firebase/FirestoreApi";
import { query as queryFirebase, where } from "firebase/firestore";

export const MembersDetails = ({
  members,
  creator,
  query,
  isBoard
}: {
  members: string[];
  query: UseMutationResult<any, unknown, Partial<BoardType | TaskType>>;
  creator?: string;
  isBoard?: boolean
}) => {

  const queryClient = useQueryClient();

  const handleDeleteMember = async (id: string) => {
    try {
      await query.mutateAsync(
        {
          members: members.filter((member) => member !== id)
        }
      );
  
      if (isBoard) {
        const tasks: TaskType[] = await FirestoreApi.fetchDocs({
          collectionName: "tasks",
          firestoreFilterFn: (colRef) => {
            return queryFirebase(colRef, where("members", "array-contains", id));
          },
        });
  
        // Mise à jour des tâches en parallèle avec Promise.all
        await Promise.all(
          tasks.map(async (task: TaskType) => {
            const updatedMembers = task.members ? task.members.filter((member) => member !== id) : [];
  
            await FirestoreApi.updateDocument<TaskType>("tasks", {
              members: updatedMembers, // Mise à jour des membres après suppression
            }, task.id);
  
            queryClient.invalidateQueries({ queryKey: ["tasks", task.id] });
          })
        );
      }
    } catch (error) {
      console.error("Error deleting member:", error); // Gestion des erreurs
      throw new Error("Failed to delete member");
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

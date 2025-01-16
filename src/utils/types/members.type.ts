import { UseMutationResult } from "@tanstack/react-query";
import { BoardType } from "./boards.types";
import { MutationResultType } from "./form.types";
import { TaskType } from "./tasks.types";

export type MembersDetailsProps<T> = {
  members: string[];
  mutationQuery: MutationResultType<string, T>;
  creator?: string;
  isBoard?: boolean;
};

export type AddMemberProps<T> = {
  queryKey: string[];
  members: string[];
  mutationQuery: MutationResultType<string, T>;
  board?: BoardType;
};

export type AddMemberInTaskProps= {
  queryKey: string[];
  taskMembers: string[];
  members: string[];
  mutationQuery: UseMutationResult<string, Error, Partial<TaskType>, unknown>
  board?: BoardType;
};

export type MemberProps = {
    userId: string;
    type: "list" | "avatar";
    creator?: string;
    handleDeleteMember?: (id: string) => Promise<void>;
    isTaskView?: boolean
}

export type MembersAvatarListProps = {
    members: string[];
  } 

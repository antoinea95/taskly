import { BoardType } from "./boards.types";
import { MutationResultType } from "./form.types";

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

import { MutationResultType } from "./form.types";

export type DateRange = {
  completed: boolean,
  from: string | null,
  to: string,
}
  
  export type TaskTagType = {
    title: string,
    color: string
  }
  
  export type TaskCommentType = {
    userId: string,
    title: string,
    createdAt: number
  }
  
  export type CheckListType = {
    id: string;
    title: string;
    createdAt: number;
    items?: CheckListItemType[];
  }
  
  export type CheckListItemType = {
    id: string;
    title: string;
    createdAt: number;
    done: boolean;
    dueDate?: Date;
  }

export type TaskCommentsSectionProps = {
  mutationQuery: MutationResultType<string, Partial<TaskType>>;
  userId: string;
  comments?: TaskCommentType[];
}


export type TaskCommentProps = {
    comment: TaskCommentType;
} & TaskCommentsSectionProps

export type TaskType = {
  id: string;
  title: string;
  description?: string;
  dueDate?: DateRange;
  labels?: TaskTagType[];
  comments?: TaskCommentType[];
  members?: string[];
  files?: {name: string, url: string}[];
  createdAt: number;
};
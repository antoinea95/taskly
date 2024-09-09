import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";

export type StatusType = "success" | "loading" | "error" | null;
export type ErrorType =  string | null;



export type TaskType = {
    id: string;
    title: string;
    description?: string;
    dueDate?: Date;
    labels?: string[];
    comments?: Comment[];
    assignedTo?: string[];
  };
  
export type ListType = {
    id: string;
    title: string;
    cards: TaskType[];
  };
  
export type BoardType = {
    id: string;
    title: string;
    members: string[]; 
  };

export type DialogType = {
  triggerName: string,
  icon: LucideIcon,
  dialogName: string, 
  children: (props: { closeModal: () => void }) => ReactNode;
}
import { ZodType } from "zod";

export type Status = "success" | "loading" | "error" | null;
export type Error =  string | null;



export type Task = {
    id: string;
    title: string;
    description?: string;
    dueDate?: Date;
    labels?: string[];
    comments?: Comment[];
    assignedTo?: string[];
  };
  
export type List = {
    id: string;
    title: string;
    cards: Task[];
  };
  
export type Board = {
    id: string;
    title: string;
    members: string[]; 
  };

export type DialogType = {
  triggerName: string,
  dialogName: string, 
}
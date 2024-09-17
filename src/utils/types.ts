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
    listId: string;
    createdAt: number;
  };
  
export type ListType = {
    id: string;
    title: string;
    createdAt: number;
  };
  
export type BoardType = {
    id: string;
    title: string;
    members: string[]; 
    createdAt: number;
  };
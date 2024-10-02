export type StatusType = "success" | "loading" | "error" | null;
export type ErrorType =  string | null;


export type UserType = {
  id: string;
  email: string;
  name: string;
  photoURL?: string
}

export type CheckListType = {
  id: string;
  title: string;
  createdAt: number;
}

export type CheckListItemType = {
  id: string;
  title: string;
  createdAt: number;
  done: boolean;
  dueDate?: Date;
}

export type DateRange = {
  completed: boolean,
  from: string | null,
  to: string,
}

export type TaskType = {
    id: string;
    title: string;
    description?: string;
    dueDate?: DateRange;
    labels?: string[];
    comments?: Comment[];
    assignedTo?: string[];
    createdAt: number;
  };
  
export type ListType = {
    id: string;
    title: string;
    createdAt: number;
    boardId: string;
    tasks: string[];
  };
  
export type BoardType = {
    id: string;
    title: string;
    members: string[]; 
    creator: string;
    createdAt: number;
  };

export type InputType = 'text' | 'email' | 'password' | 'number' | 'textarea';


export type FormContent = {
  name: string, 
  type: InputType,
  placeholder: string, 
  label?: string;
  hidden?: boolean;
}[]
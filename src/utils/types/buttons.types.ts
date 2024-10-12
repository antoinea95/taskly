import { Dispatch, ReactNode, SetStateAction } from "react";


export type ToggleButtonProps = {
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}


export type SubmitButtonProps = {
  isPending: boolean,
  disabled?: boolean
}

export type DeleteButtonProps = {
  children: (props: ToggleButtonProps) => ReactNode;
  content?: string;
};

export type DeleteConfirmationProps = {
  actionName: string;
  handleDelete: () => Promise<void>;
  isPending: boolean;
} & ToggleButtonProps;


export type MemberButtonProps = {
  type: string;
} & ToggleButtonProps



import { PropsWithChildren, HTMLAttributes } from "react";

interface MembersAvatarListProps extends PropsWithChildren<HTMLAttributes<HTMLDivElement>> {
  members: string[];
}

export const MembersAvatarList = ({ children, members, ...rest }: MembersAvatarListProps) => {
  return (
    <div className="flex justify-end -space-x-4" {...rest}>
      {children}
      {members.length > 5 && (
        <div className="w-8 h-8 rounded-full bg-gray-50 border-2 text-black flex items-center justify-center text-sm font-semibold z-10">
          +{members.length - 5}
        </div>
      )}
    </div>
  );
};

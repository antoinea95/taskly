import { PropsWithChildren, HTMLAttributes } from "react";
import { MembersAvatarListProps } from "../../utils/types/members.type";

/**
 * MembersAvatarList component
 *
 * Displays a list of member avatars. If there are more than 5 members,
 * it shows a "+X" indicator to show how many additional members exist.
 *
 * @param {MembersAvatarListProps & PropsWithChildren<HTMLAttributes<HTMLDivElement>>} props - The props required to render the component:
 * - children: elements passed as children (e.g. avatars).
 * - members: an array of members to be displayed.
 * - rest: other HTML div attributes.
 *
 * @returns JSX element showing up to 5 member avatars and an indicator if there are more.
 */
export const MembersAvatarList = ({
  children,
  members,
  ...rest
}: PropsWithChildren<MembersAvatarListProps & HTMLAttributes<HTMLDivElement>>) => {
  return (
    <div className="flex justify-end -space-x-4" {...rest}>
      {children}
      {/* Display additional member count if there are more than 5 members */}
      {members.length > 5 && (
        <div className="w-8 h-8 rounded-full bg-gray-50 border-2 text-black flex items-center justify-center text-sm font-semibold z-10">
          +{members.length - 5}
        </div>
      )}
    </div>
  );
};

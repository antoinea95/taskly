import { UserType } from "@/components/types/auth.types";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { AvatarImage } from "@radix-ui/react-avatar";
import { Skeleton } from "../ui/skeleton";
import { Button } from "../ui/button";
import { UserMinus } from "lucide-react";
import { MemberProps } from "../types/members.type";
import { useAuth } from "@/utils/hooks/FirestoreHooks/auth/useAuth";
import { useGetDoc } from "@/utils/hooks/FirestoreHooks/queries/useGetDoc";

/**
 * Member component
 *
 * Displays the avatar, name, and email of a member. It handles different views like
 * list view or task view and allows the current user (if creator) to remove a member.
 *
 * @param {MemberProps} props - The properties required to render the component:
 * - userId: the ID of the user being displayed
 * - type: whether to display as an avatar or in a list
 * - creator: ID of the board or task creator
 * - handleDeleteMember: function to handle removing a member (optional)
 * - isTaskView: whether the current view is a task view (optional)
 *
 * @returns {JSX.Element | null} A JSX element displaying member details or skeleton if loading.
 */
export const Member = ({
  userId,
  type,
  creator,
  handleDeleteMember,
  isTaskView
}: MemberProps) => {

  const { currentUser } = useAuth();
  const {
    data: member,
    isFetched,
    isError,
  } = useGetDoc<UserType>("users", userId);
  
  // Fallback value for the avatar in case no photoURL is available
  const fallback = member?.name.charAt(0);
  
  // Check if the member is the creator of the board/task
  const isCreator = member?.id === creator;
  
  // Check if the current user is the creator
  const isCurrentUserCreator = currentUser?.id === creator;

  // Return null if there's an error or no current user is found
  if (isError || !currentUser) {
    return null;
  }

  // Display loading skeletons if data is not yet fetched
  if (!isFetched) {
    if (type === "avatar") {
      return <Skeleton className="w-8 h-8 rounded-full" />;
    } else {
      return (
        <div>
          <Skeleton className="w-64 h-10 rounded-xl" />
        </div>
      );
    }
  }

  return (
    <>
      {member && isFetched && (
        <div className="flex items-center gap-2">
          {/* Avatar of the member */}
          <Avatar className="w-8 h-8 rounded-full border-2">
            <AvatarImage src={member?.photoURL} className="object-cover w-full h-full bg-white" />
            <AvatarFallback>{fallback}</AvatarFallback>
          </Avatar>

          {/* List view: display member name, email, and delete option if applicable */}
          {type === "list" && (
            <div className="flex flex-col relative w-full">
              <p className="text-sm font-bold leading-3 ">
                {member.name}{" "}
                {isCreator && (
                  <span className="text-gray-500 text-sm"> - Creator</span>
                )}
              </p>
              <span className="text-xs max-w-40 truncate hover:whitespace-normal hover:max-w-none transition-all duration-300">
                {member.email}
              </span>

              {/* Delete button: visible for the task view or if the current user is the creator */}
              {((isTaskView || isCurrentUserCreator) && !isCreator && handleDeleteMember) && (
                <Button
                  onClick={() => handleDeleteMember(member.id)}
                  className="absolute right-0 top-0 bg-gray-50 w-fit h-fit py-2 gap-2 text-black border-none shadow-none hover:bg-gray-300 text-[10px] px-3"
                >
                  <UserMinus size={16} />
                </Button>
              )}
            </div>
          )}
        </div>
      )}
    </>
  );
};

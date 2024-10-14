import { UserType } from "@/utils/types/auth.types";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { AvatarImage } from "@radix-ui/react-avatar";
import { Skeleton } from "../ui/skeleton";
import { Button } from "../ui/button";
import { UserMinus } from "lucide-react";
import { MemberProps } from "../../utils/types/members.type";
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
 * @returns  A JSX element displaying member details or skeleton if loading.
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
          <Skeleton className="w-72 h-10 rounded-xl" />
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
            <div className="flex items-center justify-between w-full">
            <div className="flex flex-col relative">
              <p className="text-sm font-bold leading-3 ">
                {member.name}{" "}
                {isCreator && (
                  <span className="text-gray-500 text-sm"> - Creator</span>
                )}
              </p>
              <span className="text-xs max-w-40 truncate hover:whitespace-normal hover:max-w-none transition-all duration-300">
                {member.email}
              </span>
              </div>

              {/* Delete button: visible for the task view or if the current user is the creator */}
              {((isTaskView || isCurrentUserCreator) && !isCreator && handleDeleteMember) && (
                <Button
                  onClick={() => handleDeleteMember(member.id)}
                  className="rounded-xl dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-500"
                  variant="outline"
                  size="icon"
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

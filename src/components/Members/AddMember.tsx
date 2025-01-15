import { useEffect, useState } from "react";
import { CircleCheck } from "lucide-react";
import { Input } from "../ui/input";
import { Member } from "./Member";
import { Button } from "../ui/button";
import { Loader } from "../ui/loader";
import { CloseButton } from "../Button/CloseButton";
import { useQueryClient } from "@tanstack/react-query";
import { useFilteredUsers } from "../../utils/helpers/hooks/useFilteredUsers";
import { useSelectedUsers } from "../../utils/helpers/hooks/useSelectedUsers";
import { MemberButton } from "../Button/MemberButton";
import { AddMemberProps } from "../../utils/types/members.type";
import { useSendInvitationLink } from "@/utils/hooks/FirestoreHooks/auth/useSign";
import { NotificationBanner } from "../Notification/NotificationBanner";

/**
 * AddMember component
 *
 * This component allows board creator to search user by mail and select it to add to the board.
 * If the user email is linked to an account, return the user else we can send a invitation link.
 *
 * @template T - The type of the mutation query payload.
 * @param {AddMemberProps<T>} props - The props for the AddMember component.
 * @param {any[]} props.key - The query key used for invalidating cache after mutation.
 * @param {string[]} props.members - The current members of the board or task.
 * @param {Object} props.mutationQuery - The mutation query function to add members.
 * @param {boolean} props.board - Indicates if the component is used for a board or task.
 * @returns A component to search for and add members.
 */
export const AddMember = <T,>({ queryKey, mutationQuery, board }: AddMemberProps<T>) => {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const { handleSearchByName, user, setEmail, isEmailValid, email } = useFilteredUsers();
  const { selectedUserIds, setSelectedUsersId, handleSelectUser } = useSelectedUsers();
  const sendEmailInvitation = useSendInvitationLink();

  // Reset user when closing the form
  useEffect(() => {
    if (user && !isOpen) {
      queryClient.invalidateQueries({ queryKey: ["user", user?.email] });
      setEmail(null);
    }
  }, [isOpen, user, queryClient, setEmail]);

  /**
   * Handle the process of adding selected members.
   * It updates the list of members and invalidates the related query key to refresh the data.
   */
  const handleAddMembers = async () => {
    if (!board || !user) return;

    mutationQuery.mutate(
      {
        members: [...board.members, ...selectedUserIds],
      } as T,
      {
        onSuccess: () => {
          setSelectedUsersId([]);
          queryClient.invalidateQueries({ queryKey });
          queryClient.invalidateQueries({ queryKey: ["user", user?.email] });
          setIsOpen(false);
          setEmail(null);
        },
      }
    );
  };

  const handleSendInvitationByEmail = async () => {
    if (!isEmailValid.success || !email || !board) return;
    await sendEmailInvitation.mutateAsync({ email: email, boardId: board.id});
  };

  const isPending = mutationQuery.isPending || sendEmailInvitation.isPending;

  return (
    <>
      {!isOpen ? (
        <MemberButton setIsOpen={setIsOpen} type={queryKey[0]} />
      ) : (
        <div className={`space-y-4 rounded-xl z-10 min-w-72 p-3 bg-white animate-fade-in ${!board ? "max-w-72 p-3" : ""} dark:bg-gray-900`}>
          {/* Input for searching users by name */}
          <Input
            className="h-10 border-none shadow-none bg-gray-200 dark:bg-gray-600 dark:text-gray-300 rounded-xl w-full"
            placeholder="Search user by email"
            onChange={handleSearchByName}
          />
          {/* Display list of filtered search results */}
          <div>
            {user && board ? (
              <Button
                onClick={() => handleSelectUser(user.id)} // Select user on click
                className="relative justify-between text-left shadow-none gap-3 w-full bg-transparent dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 h-12"
                variant="secondary"
                disabled={board.members.includes(user.id)}
              >
                <Member userId={user.id} type="list" />
                {(selectedUserIds.includes(user.id) || board.members.includes(user.id)) && (
                  <CircleCheck size={16} className="text-green-500 absolute right-2 -translate-y-1/2 top-1/2 z-10" />
                )}
              </Button>
            ) : (
              isEmailValid.success && !user && <p className="text-sm text-center text-gray-300">No user with this email was found</p>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              onClick={isEmailValid.success && !user ? handleSendInvitationByEmail : handleAddMembers}
              className="flex-1 rounded-xl dark:text-gray-900 dark:bg-gray-300"
              disabled={!isEmailValid.success}
            >
              {isPending ? (
                <Loader data={{ color: "white", size: "1rem" }} />
              ) : selectedUserIds.length > 0 ? (
                `Add member to board`
              ) : user ? (
                "Select a member"
              ) : isEmailValid.success && !user ? (
                "Send an invitation"
              ) : (
                "Searching..."
              )}
            </Button>
            <CloseButton setIsOpen={setIsOpen} />
          </div>
          {!sendEmailInvitation.isPending && (
              <NotificationBanner
                content={sendEmailInvitation.error ? "Error while sending inviation" : "Invitation sent!"}
                isError={sendEmailInvitation.isError}
                isSuccess={sendEmailInvitation.isSuccess}
              />
            )}
        </div>
      )}
    </>
  );
};

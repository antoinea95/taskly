import { useState } from "react";
import { CircleCheck } from "lucide-react";
import { Input } from "../ui/input";
import { Member } from "./Member";
import { Button } from "../ui/button";
import { Loader } from "../ui/loader";
import { CloseButton } from "../Button/CloseButton";
import { useQueryClient } from "@tanstack/react-query";
import { ScrollArea } from "../ui/scroll-area";
import { useSelectedUsers } from "../../utils/helpers/hooks/useSelectedUsers";
import { MemberButton } from "../Button/MemberButton";
import { AddMemberInTaskProps } from "../../utils/types/members.type";
import { useFilteredUsersInTasks } from "@/utils/helpers/hooks/useFilteredUsersTasks";

/**
 * AddMember component
 *
 * This component allows users to search for and select members to add to a board or task.
 * The list of members is updated and saved using the provided mutation query.
 *
 * @param {any[]} props.key - The query key used for invalidating cache after mutation.
 * @param {string[]} props.members - The current members of the board or task.
 * @param {Object} props.mutationQuery - The mutation query function to add members.
 * @param {boolean} props.board - Indicates if the component is used for a board or task.
 * @returns A component to search for and add members.
 */
export const AddMemberToTask = ({
  queryKey,
  taskMembers,
  members,
  mutationQuery,
  board,
}: AddMemberInTaskProps) => {

  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const { handleSearchByName, searchResults } = useFilteredUsersInTasks(members, taskMembers, board);
  const { selectedUserIds, setSelectedUsersId, handleSelectUser } = useSelectedUsers();

  /**
   * Handle the process of adding selected members.
   * It updates the list of members and invalidates the related query key to refresh the data.
   */
  const handleAddMembers = async () => {
    mutationQuery.mutate(
      {
        members: [...taskMembers, ...selectedUserIds], // Add the selected user IDs to the members list
      },
      {
        onSuccess: () => {
          setSelectedUsersId([]); // Reset the selected users state
          queryClient.invalidateQueries({
            queryKey // Invalidate the query to trigger data refetch
          });
          setIsOpen(false); // Close the member selection modal
        },
      }
    );
  };


  return (
    <>
      {!isOpen ? (
        <MemberButton setIsOpen={setIsOpen} type={queryKey[0]} />
      ) : (
        <div className={`space-y-4 rounded-xl z-10 min-w-72 bg-white animate-fade-in ${!board ? "max-w-72 p-3" : ""} dark:bg-gray-900`}>
          {/* Input for searching users by name */}
          <Input
            className="h-10 border-none shadow-none bg-gray-200 dark:bg-gray-600 dark:text-gray-300 rounded-xl w-full"
            placeholder="Search user"
            onChange={handleSearchByName}
          />
          {/* Display list of filtered search results */}
          <ScrollArea className="h-44">
            <div>
              {searchResults &&
                searchResults.map((user) => (
                  <Button
                    key={user.id}
                    onClick={() => handleSelectUser(user.id)} // Select user on click
                    className="relative justify-between text-left shadow-none gap-3 w-full bg-transparent dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 h-12"
                    variant="secondary"
                  >
                    <Member userId={user.id} type="list" />
                    {selectedUserIds.includes(user.id) && (
                      <CircleCheck
                        size={16}
                        className="text-green-500 absolute right-2 -translate-y-1/2 top-1/2 z-10"
                      />
                    )}
                  </Button>
                ))}
            </div>
          </ScrollArea>
          {/* Add members button and close button */}
          <div className="flex items-center space-x-2">
            <Button
              onClick={handleAddMembers}
              className="flex-1 rounded-xl dark:text-gray-900 dark:bg-gray-300"
              disabled={selectedUserIds.length === 0} // Disable if no users selected
            >
              {mutationQuery.isPending ? (
                <Loader data={{ color: "white", size: "1rem" }} />
              ) : selectedUserIds.length > 0 ? (
                `Add ${selectedUserIds.length} members`
              ) : (
                "Select members"
              )}
            </Button>
            <CloseButton setIsOpen={setIsOpen} />
          </div>
        </div>
      )}
    </>
  );
};
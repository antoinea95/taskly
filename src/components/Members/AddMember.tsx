import { BoardType, TaskType } from "@/utils/types";
import { useState } from "react";
import { CircleCheck, X } from "lucide-react";
import { Input } from "../ui/input";
import { Member } from "./Member";
import { Button } from "../ui/button";
import { Loader } from "../ui/loader";
import { CloseButton } from "../Button/CloseButton";
import { UseMutationResult, useQueryClient } from "@tanstack/react-query";
import { ScrollArea } from "../ui/scroll-area";
import { useFilteredUsers } from "./useFilteredUsers";
import { useSelectedUsers } from "./useSelectedUsers";
import { MemberButton } from "../Button/MemberButton";

export const AddMember = ({
  queryName,
  board,
  queryId,
  members,
  query,
}: {
  queryName: "tasks" | "boards",
  board?: BoardType
  queryId: string;
  members: string[];
  query: UseMutationResult<any, unknown, Partial<BoardType | TaskType>>;
}) => {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
 const {handleSearchByName, searchResults, isFetched} = useFilteredUsers(members, board)
  const {selectedUserIds, setSelectedUsersId, handleSelectUser} = useSelectedUsers();

  const handleAddMembers = async () => {
    query.mutate(
      {
        members: [...members, ...selectedUserIds],
      },
      {
        onSuccess: () => {
          setSelectedUsersId([]);
          queryClient.invalidateQueries({
            queryKey: [queryName, queryId],
          });
          setIsOpen(false);
        },
      }
    );
  };

  if (!isFetched) {
    return <div className="bg-white rounded-xl w-72 h-80 z-10"></div>;
  }

  return (
    <>
      {!isOpen ? (
        <MemberButton setIsOpen={setIsOpen} type={queryName} />
      ) : (
        <div className="space-y-4 rounded-xl w-72 z-10 bg-white p-3 animate-fade-in">
          <Input
            className="h-10 border-none shadow-none bg-gray-300 rounded-xl w-full"
            placeholder="Search user"
            onChange={handleSearchByName}
          />
          <ScrollArea className="h-44">
            <div>
              {searchResults &&
                searchResults.map((user) => (
                  <Button
                    key={user.id}
                    onClick={() => handleSelectUser(user.id)}
                    className=" relative bg-transparent text-black justify-between w-64 px-3 text-left h-15 shadow-none hover:bg-gray-200 gap-3"
                  >
                    <Member userId={user.id} type="list" />
                    {selectedUserIds.includes(user.id) && (
                      <CircleCheck size={16} className="text-green-500 absolute right-2 -translate-y-1/2 top-1/2 z-10" />
                    )}
                  </Button>
                ))}
            </div>
          </ScrollArea>
          <div className="flex items-center space-x-2">
            <Button
              onClick={handleAddMembers}
              className="w-full"
              disabled={selectedUserIds.length === 0}
            >
              {query.isPending ? (
                <Loader data={{ color: "white", size: "1rem" }} />
              ) : selectedUserIds.length > 0 ? (
                `Add ${selectedUserIds.length} members`
              ) : (
                "Select members"
              )}
            </Button>
            <CloseButton setIsOpen={setIsOpen}>
              <X size={16} />
            </CloseButton>
          </div>
        </div>
      )}
    </>
  );
};

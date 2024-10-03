import { useState, useEffect, ChangeEvent } from "react";
import { useGetUsers } from "@/firebase/fetchHook";
import { BoardType, UserType } from "@/utils/types";

export const useFilteredUsers = (
  members: string[],
  board?: BoardType,
) => {
  const { data: users, isFetched } = useGetUsers();
  const [filterUsers, setFilterUsers] = useState<UserType[] | null>(null);
  const [searchResults, setSearchResults] = useState<UserType[] | null>(null);

  useEffect(() => {
    if (users && isFetched) {
      let allUsers = users;
      
      if (board) {
        allUsers = allUsers.filter((user) => board.members.includes(user.id));
      }
      const nonMembers = allUsers.filter((user) => !members.includes(user.id));
      setFilterUsers(nonMembers);
      setSearchResults(nonMembers);
    }
  }, [users, isFetched, members, board]);

  const handleSearchByName = (e: ChangeEvent<HTMLInputElement>) => {

    const searchQuery = e.target.value.toLowerCase();
    if (filterUsers) {
      const filtered = filterUsers.filter((user) =>
        user.name.toLowerCase().includes(searchQuery)
      );
      setSearchResults(filtered);
    }
  };

  return {
    searchResults,
    handleSearchByName,
    isFetched,
  };
};
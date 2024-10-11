// src/hooks/useSelectedUsers.ts
import { useState } from "react";

export const useSelectedUsers = () => {
  const [selectedUserIds, setSelectedUsersId] = useState<string[]>([]);

  const handleSelectUser = (id: string) => {
    setSelectedUsersId((prev) =>
      prev.includes(id) ? prev.filter((selectedId) => selectedId !== id) : [...prev, id]
    );
  };

  return {
    selectedUserIds,
    setSelectedUsersId,
    handleSelectUser,
  };
};
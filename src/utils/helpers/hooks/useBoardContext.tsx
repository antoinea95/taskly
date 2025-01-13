import { useContext } from "react";
import { BoardContext } from "../context/BoardContext";

export const useBoardContext = () => {
  const boardContext = useContext(BoardContext);

  if (!boardContext) {
    throw new Error("Components ListsSection must be within a BoardContext Provider");
  }
  return boardContext;
};

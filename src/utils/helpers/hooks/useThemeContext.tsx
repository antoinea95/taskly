import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

export const useTheme = () => {
  const context = useContext(ThemeContext);

  if (context === null) {
    throw new Error("Context must be used within a context provider");
  }

  return context;
};

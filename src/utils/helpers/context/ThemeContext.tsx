import { createContext, PropsWithChildren, useCallback, useEffect, useState } from "react";

export const ThemeContext = createContext<{
  theme: boolean;
  toggleTheme: () => void;
} | null>(null);

export const ThemeContextProvider = ({ children }: PropsWithChildren) => {

    const [theme, setTheme] = useState<boolean>(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme ? JSON.parse(savedTheme) : false;
  });

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const newTheme = !prev;
      localStorage.setItem('theme', JSON.stringify(newTheme));
      document.body.classList.toggle("dark", newTheme);
      return newTheme;
    });
  }, []);

  useEffect(() => {
    if (theme) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [theme]);

  const value = {
    theme,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
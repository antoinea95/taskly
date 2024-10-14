import { createContext, PropsWithChildren, useCallback, useState } from "react";

export const ThemeContext = createContext<{
  theme: boolean;
  toggleTheme: () => void;
} | null>(null);

export const ThemeContextProvider = ({children} : PropsWithChildren) => {

    const [theme, setTheme] = useState(false);

    const toggleTheme = useCallback(() => {
        setTheme((prev) => !prev);
        document.body.classList.toggle("dark");
    }, []);

    const value = {
        theme, 
        toggleTheme
    }

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    )
}
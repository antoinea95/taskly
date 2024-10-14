import { NavLink, Outlet } from "react-router-dom";
import { Sidebar } from "@/components/Nav/Sidebar";
import { PrivateRoute } from "./PrivateRoute";
import { useTheme } from "@/utils/helpers/hooks/useThemeContext";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Root = () => {
  const { theme, toggleTheme } = useTheme();

  const handleToggle = () => {
    toggleTheme();
  };

  console.log(theme)

  return (
    <main className="font-outfit relative h-screen w-full  dark:bg-gray-950">
      <nav className="h-screen pt-5 flex flex-col fixed border-r top-0 left-0 w-1/6 px-4 space-y-3 overflow-hidden">
        <h2 className="font-extrabold uppercase text-xl flex items-center justify-between">
          <NavLink to={"/"} className="dark:text-gray-300">Taskly</NavLink>
          <Button onClick={handleToggle} size="icon" className="rounded-full dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-500" variant="secondary" >
            {theme ? <Moon size={16} /> : <Sun size={16} />}
          </Button>
        </h2>
        <Sidebar />
      </nav>
      <section className="py-5 px-8 flex flex-col w-5/6 mr-0 ml-auto overflow-auto h-full">
        <PrivateRoute component={Outlet} />
      </section>
    </main>
  );
};

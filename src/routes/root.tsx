import { NavLink, Outlet } from "react-router-dom";
import { Sidebar } from "@/components/Nav/Sidebar";
import { PrivateRoute } from "./PrivateRoute";
import { useTheme } from "@/utils/helpers/hooks/useThemeContext";
import { ChevronRight, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export const Root = () => {
  const { theme, toggleTheme } = useTheme();
  const [openSideBar, setOpenSideBar] = useState(false);

  const handleToggle = () => {
    toggleTheme();
  };

  return (
    <main className="font-outfit h-screen w-full dark:bg-gray-950">
      <nav
        className={`animate-fade-in  z-20 h-screen pt-5 flex flex-col space-y-3 transition-all w-72 px-3 border-r bg-white dark:bg-gray-950 dark:border-gray-600 absolute top-0 left-0 ${openSideBar ? "translate-x-0" : "-translate-x-64 pr-12"}`}
      >
        <Button
          onClick={() => setOpenSideBar((prev) => !prev)}
          size="icon"
          className="z-20 absolute top-1/2 -translate-y-1/2 -right-4 rounded-full dark:hover:bg-gray-600 dark:bg-gray-700 dark:text-gray-300"
        >
          <ChevronRight
            size={16}
            className={`${openSideBar ? "rotate-180" : ""} transition-transform`}
          />
        </Button>
        <h2 className="font-extrabold uppercase text-xl flex items-center justify-between">
          <NavLink to={"/"} className="dark:text-gray-300">
            Taskly
          </NavLink>
          <Button
            onClick={handleToggle}
            size="icon"
            className="rounded-full dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-500"
            variant="secondary"
          >
            {theme ? <Moon size={16} /> : <Sun size={16} />}
          </Button>
        </h2>
        <Sidebar />
      </nav>
      <section className="px-14 py-10 flex flex-col mr-0 ml-auto overflow-auto h-full flex-1">
        <PrivateRoute component={Outlet} />
      </section>
    </main>
  );
};

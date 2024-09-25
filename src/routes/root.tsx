import { Outlet } from "react-router-dom";
import { Sidebar } from "@/components/Nav/Sidebar";


export const Root = () => {

  return (
    <main className="font-outfit flex">
      <nav className="w-1/6 border-r h-screen pt-5 px-3 flex flex-col">
        <h2 className="font-extrabold uppercase text-xl mb-3 px-2">Taskly</h2>
        <Sidebar />
      </nav>
      <section className="w-5/6 pt-5 px-10 flex flex-col bg-gray-100">
        <Outlet />
      </section>
    </main>
  );
};

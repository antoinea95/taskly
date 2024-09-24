import { Outlet } from "react-router-dom";
import { Sidebar } from "@/components/Nav/Sidebar";
import { Header } from "@/components/Nav/Header";


export const Root = () => {

  return (
    <main className="font-outfit flex">
      <nav className="w-1/6 border-r h-screen pt-5 px-3 flex flex-col">
        <h2 className="font-extrabold uppercase text-xl mb-3 px-2">Taskly</h2>
        <Sidebar />
      </nav>
      <section className="w-5/6 pt-5 flex flex-col items-center justify-center">
         <Header />
        <section className="px-10 flex-1 w-full flex flex-col">
        <Outlet />
        </section>
      </section>
    </main>
  );
};

import { NavLink, Outlet } from "react-router-dom";
import { Sidebar } from "@/components/Nav/Sidebar";
import { PrivateRoute } from "./PrivateRoute";

export const Root = () => {
  return (
    <main className="font-outfit grid grid-cols-5">
      <nav className="border-r h-screen pt-5 px-3 flex flex-col">
        <h2 className="font-extrabold uppercase text-xl mb-3 px-2">
          <NavLink to={"/"}>Taskly</NavLink>
        </h2>
        <Sidebar />
      </nav>
      <section className="col-span-4 pt-5 px-10 flex flex-col bg-gray-50">
          <PrivateRoute component={Outlet} />
      </section>
    </main>
  );
};

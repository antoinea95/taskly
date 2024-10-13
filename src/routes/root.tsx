import { NavLink, Outlet } from "react-router-dom";
import { Sidebar } from "@/components/Nav/Sidebar";
import { PrivateRoute } from "./PrivateRoute";

export const Root = () => {
  return (
    <main className="font-outfit grid grid-cols-7 relative">
      <nav className="h-screen pt-5 flex flex-col fixed bg-white top-0 left-0 w-66">
        <h2 className="font-extrabold uppercase text-xl mb-3 px-2">
          <NavLink to={"/"} className="px-2">Taskly</NavLink>
        </h2>
        <Sidebar />
      </nav>
      <section className="col-span-6 col-start-2 pt-5 px-10 flex flex-col bg-gray-50 h-fit">
          <PrivateRoute component={Outlet} />
      </section>
    </main>
  );
};

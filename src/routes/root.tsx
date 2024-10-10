import { Navigate, NavLink, Outlet } from "react-router-dom";
import { Sidebar } from "@/components/Nav/Sidebar";
import { useAuth } from "@/utils/hooks/FirestoreHooks/auth/useAuth";


export const Root = () => {

  const {currentUser, isLoading} = useAuth();

  // Redirect to login page when user in logged out
  if(!currentUser && !isLoading) {
    return <Navigate to="/login" />
  }

  return (
    <main className="font-outfit grid grid-cols-5">
      <nav className="border-r h-screen pt-5 px-3 flex flex-col">
        <h2 className="font-extrabold uppercase text-xl mb-3 px-2">
          <NavLink to={"/"}>
            Taskly
          </NavLink>
        </h2>
        <Sidebar />
      </nav>
      <section className="col-span-4 pt-5 px-10 flex flex-col bg-gray-50">
        <Outlet />
      </section>
    </main>
  );
};

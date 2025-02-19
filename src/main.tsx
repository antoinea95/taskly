import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Root } from "../src/routes/root.tsx";
import { BoardPage } from "./pages/BoardPage.tsx";
import { LoginPage } from "./pages/LoginPage.tsx";
import { HomePage } from "./pages/HomePage.tsx";
import { ProfilePage } from "./pages/ProfilePage.tsx";
import { ErrorPage } from "./pages/ErrorPage.tsx";
import { ThemeContextProvider } from "./utils/helpers/context/ThemeContext.tsx";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    },
  },
});

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/:boardId",
        element: <BoardPage />,
      },
      {
        path: "/profile",
        element: <ProfilePage />,
      },
    ],
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/complete-signup",
    element: <LoginPage />
  }
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeContextProvider>
        <RouterProvider router={router} />
        <ReactQueryDevtools initialIsOpen={false} />
      </ThemeContextProvider>
    </QueryClientProvider>
  </StrictMode>
);

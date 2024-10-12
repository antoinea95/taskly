import { useAuth } from "@/utils/hooks/FirestoreHooks/auth/useAuth";
import { ElementType } from "react";
import { Navigate } from "react-router-dom";

/**
 * A component that wraps children and checks if the user is authenticated.
 * If the user is not authenticated, it redirects them to the login page.
 *
 * @param {Object} props - The props for the component.
 * @param {JSX.Element} props.children - The child elements to render if the user is authenticated.
 * @returns - A <Navigate> component to redirect to the login page or the children elements.
 */
export const PrivateRoute = ({
  component: Component,
}: {
  component: ElementType;
}) => {
  const { currentUser: user, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  return user ? <Component /> : <Navigate to="/login" replace />;
};

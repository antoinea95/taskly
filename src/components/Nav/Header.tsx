import { AvatarFallback } from "@radix-ui/react-avatar";
import { Avatar, AvatarImage } from "../ui/avatar";
import { UserType } from "@/components/types/auth.types";
import { HeaderSkeleton } from "../Skeletons/skeletons";

/**
 * `Header` displays the user's avatar and name, or a loading skeleton if the user is not available.
 * The avatar will show the user's photo if available; otherwise, it falls back to displaying the first letter of the user's name.
 * 
 * @param {Object} props - The properties for the header component.
 * @param {UserType | null} props.user - The user object containing user information or `null` if no user is logged in.
 * 
 * @returns The rendered header component, or a skeleton loader if the user is null.
 */
export const Header = ({
  user,
}: {
  user: UserType | null;
}) => {

  // If no user is provided, show the skeleton loader.
  if (!user) {
    return <HeaderSkeleton />;
  }

  // If the user exists, get the first letter of the user's name to show in the fallback avatar.
  const fallback = user?.name?.charAt(0) || "";

  return (
    <header className="flex items-center gap-3 w-full">
      {/* User's avatar, if photoURL is available, otherwise display a fallback with the user's initials */}
      <Avatar className="w-11 h-11 rounded-full flex items-center justify-center border-2 border-black">
        {user.photoURL && (
          <AvatarImage src={user.photoURL} alt={user.name || "User avatar"} />
        )}
        <AvatarFallback
          className="flex items-center justify-center text-2xl w-full h-full bg-gray-200 pb-1"
        >
          {fallback}
        </AvatarFallback>
      </Avatar>

      {/* Display the user's name with a welcome message */}
      <div className="flex flex-col leading-tight">
        <span className="text-base text-gray-500 leading-tight w-fit">
          Welcome,
        </span>
        <span className="text-2xl font-semibold leading-tight">
          {user?.name}
        </span>
      </div>
    </header>
  );
};

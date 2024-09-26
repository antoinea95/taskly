import { AvatarFallback } from "@radix-ui/react-avatar";
import { Avatar, AvatarImage } from "../ui/avatar";
import { UserType } from "@/utils/types";
import { HeaderSkeleton } from "../skeletons";

export const Header = ({
  user,
}: {
  user: UserType | null;
}) => {

  if(!user) {
    return <HeaderSkeleton />
  }

  const fallback = user?.name?.charAt(0) || "";

  return (
    <header className="flex items-center gap-3 w-full">
      <Avatar className="w-11 h-11 rounded-full flex items-center justify-center border-2 border-black">
        <AvatarImage src={user?.photoURL} alt={user?.name || "User avatar"} />
        <AvatarFallback
          delayMs={500}
          className="flex items-center justify-center text-2xl w-full h-full bg-gray-200 pb-1"
        >
          {fallback}
        </AvatarFallback>
      </Avatar>
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

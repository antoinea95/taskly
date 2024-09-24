import { AvatarFallback } from "@radix-ui/react-avatar";
import { Avatar, AvatarImage } from "../ui/avatar";
import { useAuth } from "@/firebase/authHook";
import { useGetDoc } from "@/firebase/fetchHook";
import { useNavigate } from "react-router-dom";
import { UserType } from "@/utils/types";
import { Skeleton } from "../ui/skeleton";

export const Header = () => {
  const { currentUser:user, isLoading } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    navigate("/login");
  }

  const HeaderSkeleton = () => (
    <div className="flex items-center gap-3">
      <div>
        <Skeleton className="w-10 h-10 rounded-full" />
      </div>
      <div className="flex flex-col leading-tight gap-1">
        <Skeleton className="w-20 h-4" />
        <Skeleton className="w-48 h-7" />
      </div>
    </div>
  );

  const fallback = user?.name.charAt(0);

  return (
    <header className="flex items-center gap-3 w-full border-b px-10 pb-3">
      {isLoading ? (
        <HeaderSkeleton />
      ) : user && (
        <>
          <Avatar>
            <AvatarImage src={user?.photoURL} />
            <AvatarFallback delayMs={500}>{fallback}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col leading-tight">
            <span className="text-base text-gray-500 leading-tight w-fit">
              Welcome,
            </span>
            <span className="text-2xl font-semibold leading-tight">
              {user.name}
            </span>
          </div>
        </>
      )}
    </header>
  );
};

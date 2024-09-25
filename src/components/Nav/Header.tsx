import { AvatarFallback } from "@radix-ui/react-avatar";
import { Avatar, AvatarImage } from "../ui/avatar";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "../ui/skeleton";
import { useEffect } from "react";
import { UserType } from "@/utils/types";

export const Header = ({user, isLoading} : {user: UserType | null, isLoading: boolean}) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/login");
    }
  }, [isLoading, user, navigate]);

  const HeaderSkeleton = () => (
    <div className="flex items-center gap-3">
      <div>
        <Skeleton className="w-11 h-11 rounded-full" />
      </div>
      <div className="flex flex-col leading-tight gap-1">
        <Skeleton className="w-20 h-4" />
        <Skeleton className="w-48 h-7" />
      </div>
    </div>
  );

  const fallback = user?.name?.charAt(0) || '';

  return (
    <header className="flex items-center gap-3 w-full">
      {isLoading ? (
        <HeaderSkeleton />
      ) : (
        user && (
          <>
            <Avatar className="w-11 h-11 rounded-full flex items-center justify-center border-2 border-black">
              <AvatarImage src={user?.photoURL} alt={user?.name || "User avatar"} />
              <AvatarFallback delayMs={500} className="flex items-center justify-center text-2xl w-full h-full bg-gray-200 pb-1">
                {fallback}
              </AvatarFallback>
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
        )
      )}
    </header>
  );
};

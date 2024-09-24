import { useGetDoc } from "@/firebase/fetchHook";
import { UserType } from "@/utils/types";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { AvatarImage } from "@radix-ui/react-avatar";
import { Skeleton } from "../ui/skeleton";

export const BoardCardFooter = ({ userId }: { userId: string }) => {
  const {
    data: member,
    isFetched,
    isError,
  } = useGetDoc<UserType>("users", userId);
  const fallback = member?.name.charAt(0);

  const FooterSkeleton = () => (
    <div className="w-6 h-6 rounded-full">
      <Skeleton className="rounded-full w-6 h-6" />
    </div>
  );

  if(isError) {
    return null;
  }

  return (
    <>
      {!isFetched ? (
        <FooterSkeleton />
      ) : member ? (
        <>
        <Avatar className="w-8 h-8 rounded-full border-2 border-white">
          <AvatarImage src={member?.photoURL} />
          <AvatarFallback>{fallback}</AvatarFallback>
        </Avatar>
        </>
      ) : null}
    </>
  );
};

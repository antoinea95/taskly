import { useGetDoc } from "@/firebase/fetchHook";
import { UserType } from "@/utils/types";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { AvatarImage } from "@radix-ui/react-avatar";
import { Skeleton } from "../ui/skeleton";

export const Members = ({
  userId,
  type,
  isCreator,
}: {
  userId: string;
  type: "list" | "avatar";
  isCreator?: boolean;
}) => {
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

  if (isError) {
    return null;
  }

  if (!isFetched) {
    <FooterSkeleton />;
  }

  return (
    <>
      {member && isFetched && (
        <div className="flex items-center gap-2">
          <Avatar className="w-8 h-8 rounded-full border-2">
            <AvatarImage src={member?.photoURL} />
            <AvatarFallback>{fallback}</AvatarFallback>
          </Avatar>
          {type === "list" && (
            <div className="flex flex-col">
              <p className="text-sm font-bold leading-3">{member.name} {isCreator && <span className="text-gray-500"> - Creator</span>}</p>
              <span className="text-xs">{member.email}</span>
            </div>
          )}
        </div>
      )}
    </>
  );
};

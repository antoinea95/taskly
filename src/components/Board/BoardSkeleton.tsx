import { Card } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

export const BoardSkeleton = () => {
  return (
    <Card className="w-64 h-32 flex flex-col justify-between shadow-none border-none opacity-50">
      <Skeleton className="h-32 w-64" />
    </Card>
  );
};

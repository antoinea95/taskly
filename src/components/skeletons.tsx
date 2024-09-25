import { Card } from "./ui/card";
import { Skeleton } from "./ui/skeleton";

export const BoardSkeleton = () => {
  return (
    <main className="flex-1 flex flex-col">
      <header className="flex justify-between items-center">
        <Skeleton className="w-64 h-12" />
        <Skeleton className="w-32 h-12" />
      </header>
    </main>
  );
};

export const HomeSkeleton = () => {
  return (
    <section className="grid grid-cols-4 gap-8 w-full mt-10">
          {Array.from({ length: 12 }).map((_, index) => (
            <HomeSkeleton key={index} />
          ))}
    </section>
  );
};

export const ListSkeleton = () => {
  return (
    <Card className="border-none shadow-none rounded-xl">
      <Skeleton className="w-72 h-[500px] rounded-xl" />
    </Card>
  );
};

export const TaskSkeleton = () => {
  return (
    <Card className="shadow-none border-none">
      <Skeleton className="w-72 h-16 rounded-xl" />
    </Card>
  );
};

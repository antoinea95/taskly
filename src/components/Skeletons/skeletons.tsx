import { Skeleton } from "../ui/skeleton";
import { Card } from "../ui/card";

export const BoardPageSkeleton = () => (
  <main className="flex-1 flex flex-col">
    <header className="flex justify-between items-center">
      <Skeleton className="w-72 h-16 rounded-xl" />
      <Skeleton className="w-32 h-10 rounded-xl" />
    </header>
    <section className="overflow-x-auto flex-1 flex flex-col w-full no-scrollbar mb-10">
      <section className="flex items-start flex-nowrap mt-10 gap-5 flex-1 w-full">
        <Skeleton className="h-[600px] min-w-96 rounded-xl" />
        <Skeleton className="h-[600px] min-w-96 rounded-xl" />
        <Skeleton className="h-[600px] min-w-96 rounded-xl" />
      </section>
    </section>
  </main>
);

export const ListSkeleton = () => (
  <Skeleton className="h-[600px] min-w-96 rounded-xl" />
);

export const TaskSkeleton = () => (
  <Card className="border-none shadow-none rounded-xl">
    <Skeleton className="w-72 h-16 rounded-xl" />
  </Card>
);

export const HeaderSkeleton = () => (
  <div className="flex items-center gap-3">
    <div>
      <Skeleton className="w-11 h-11 rounded-full" />
    </div>
    <div className="flex flex-col leading-tight gap-4">
      <Skeleton className="w-20 h-4" />
      <Skeleton className="w-48 h-7" />
    </div>
  </div>
);

export const HomeSkeleton = () => (
  <main className="flex flex-col flex-1 w-full">
    <HeaderSkeleton />
    <section className="flex justify-between items-center mt-10">
      <Skeleton className="w-80 h-14" />
      <Skeleton className="w-32 h-10" />
    </section>
    <section className="grid grid-cols-4 gap-8 w-full mt-10">
      {Array.from({ length: 6 }).map((_, index) => (
        <Card key={index} className="border-none shadow-none">
          <Skeleton className="w-64 h-32 rounded-xl" />
        </Card>
      ))}
    </section>
  </main>
);

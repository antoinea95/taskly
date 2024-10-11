import { Skeleton } from "../ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

export const BoardPageSkeleton = () => (
  <main className="flex-1 flex flex-col">
    <header className="flex justify-between items-center">
      <Skeleton className="w-72 h-16" />
      <Skeleton className="w-32 h-10" />
    </header>
  </main>
);


export const ListSectionSkeleton = () => (
  <section className="overflow-x-auto flex-1 flex flex-col w-full no-scrollbar animate-fade-in">
  <section className="flex items-start flex-nowrap mt-10 gap-8 flex-1 w-full">
    {Array.from({ length: 4 }).map((_, index) => (
      <ListeSkeleton key={index} />
    ))}
  </section>
</section>
)

export const ListeSkeleton = () => (
  <div className="h-fit min-w-72 w-fit">
    <Card className="shadow-none h-fit border-none bg-transparent">
      <CardHeader className="p-0">
        <CardTitle className="text-xl font-normal">
          <Skeleton className="w-72 h-7" />
        </CardTitle>
        <Skeleton className="w-72 h-12" />
      </CardHeader>
      <CardContent className="flex flex-col gap-3 pt-3 px-0">
        {Array.from({ length: 4 }).map((_, index) => (
          <TaskSkeleton key={index} />
        ))}
      </CardContent>
    </Card>
  </div>
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
      <Skeleton className="w-80 h-14"/>
      <Skeleton className="w-32 h-10"/>
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

import { PropsWithChildren } from "react";

export const CarouselImageItem = ({ children }: PropsWithChildren) => {
  return (
    <div className="rounded-xl overflow-hidden relative h-72">
      <div className="overflow-hidden rounded-xl">{children}</div>
      <div className="w-16 h-full bg-gradient-to-l from-white dark:from-gray-950 to-transparent z-20 absolute top-0 right-0" />
      <div className="w-16 h-full bg-gradient-to-r from-white dark:from-gray-950 to-transparent z-20 absolute top-0 left-0" />
      <div className="w-full h-16 bg-gradient-to-b from-white dark:from-gray-950 to-transparent z-20 absolute top-0 left-0" />
      <div className="w-full h-16 bg-gradient-to-t from-white dark:from-gray-950 to-transparent z-20 absolute bottom-0 left-0" />
    </div>
  );
};

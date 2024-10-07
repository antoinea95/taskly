import { PropsWithChildren } from "react";

export const Tag = ({
  children,
  color,
}: PropsWithChildren<{ color: string }>) => {

  
  return (
    <span
      className={`uppercase font-bold px-2 py-1 rounded-lg text-[10px] flex items-center gap-1`}
      style={{
        backgroundColor: color
      }}
    >
      {children}
    </span>
  );
};

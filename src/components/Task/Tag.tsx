import { PropsWithChildren } from "react";

export const Tag = ({
  children,
  color,
}: PropsWithChildren<{ color: string }>) => {

  const colorClass =
    color === "red"
      ? "bg-red-300 text-red-800"
      : color === "green"
        ? "bg-green-300 text-green-800"
        : color === "orange"
          ? "bg-red-300 text-red-800"
          : "bg-gray-300 text-gray-800";

  return (
    <span
      className={`uppercase font-bold px-2 py-1 rounded-lg text-xs flex items-center gap-1 ${colorClass}`}
    >
      {children}
    </span>
  );
};

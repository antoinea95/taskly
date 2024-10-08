import { LucideIcon } from "lucide-react";
import { PropsWithChildren } from "react";

export const TaskHeaderItem = ({
  title,
  icon,
  isAction,
  children,
}: PropsWithChildren<{
  title: string;
  icon: LucideIcon;
  isAction?: boolean;
}>) => {
  const Icon = icon;

  return (
    <section className="flex flex-col px-3 gap-1 max-w-72">
      <h3 className="flex items-center gap-2 font-medium text-sm">
        <Icon size={14} />
        {title}
      </h3>
      <div
        className={`flex items-center flex-wrap gap-2 max-w-72 bg-gray-50 rounded-xl w-fit px-3 py-2 min-h-11 ${isAction ? "hover:bg-gray-200" : ""}`}
      >
        {children}
      </div>
    </section>
  );
};

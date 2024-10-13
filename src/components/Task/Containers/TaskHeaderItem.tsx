import { LucideIcon } from "lucide-react";
import { PropsWithChildren } from "react";

/**
 * TaskHeaderItem component displays a header section with an icon, title, and optional action state. 
 * It can also contain child elements, such as buttons or other interactive items.
 *
 * @param {Object} props - The properties passed to the component.
 * @param {string} props.title - The title text to be displayed in the header.
 * @param {LucideIcon} props.icon - The icon component from Lucide to be displayed alongside the title.
 * @param {boolean} [props.isAction=false] - Optional boolean to indicate if the section is an action, which affects styling (e.g., hover effects).
 * @param {React.ReactNode} props.children - Child elements to be rendered inside the item (e.g., buttons, labels, etc.).
 *
 * @returns The TaskHeaderItem component.
 */
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
    <section className="flex flex-col px-3 gap-1">
      <h3 className="flex items-center gap-2 font-medium text-sm">
        <Icon size={14} />
        {title}
      </h3>
      <div
        className={`flex items-center flex-wrap gap-2 max-w-96 bg-gray-50 rounded-xl w-fit px-3 py-2 min-h-12 ${isAction ? "hover:bg-gray-200" : ""}`}
      >
        {children}
      </div>
    </section>
  );
};

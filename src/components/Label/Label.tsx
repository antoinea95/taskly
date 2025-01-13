import { PropsWithChildren } from "react";
import { Badge } from "../ui/badge";

/**
 * `Label` component that renders a label with a customizable background color.
 *
 * @param {Object} props - The props for the Label component.
 * @param {string} props.color - The background color of the label.
 * @param {ReactNode} props.children - The content inside the label (text, elements, etc.).
 * 
 * @returns The rendered label component with the provided background color and children content.
 */
export const Label = ({
  children,
  color,
}: PropsWithChildren<{ color: string }>): JSX.Element => {
  return (
    <Badge
      style={{
        backgroundColor: color,
      }}
      className="rounded-full flex gap-1 shadow-none text-black dark:text-black text-xs px-2 py-1 h-fit border-2 border-transparent"
      variant="secondary"
    >
      {children}
    </Badge>
  );
};

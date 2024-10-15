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
      className="flex items-center justify-center gap-1 rounded-full text-[10px] border-none dark:text-gray-800 w-fit animate-fade-in"
      variant="secondary"
    >
      {children}
    </Badge>
  );
};

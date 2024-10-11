import { PropsWithChildren } from "react";

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
    <span
      className={`uppercase font-bold px-2 py-1 rounded-lg text-[10px] flex items-center gap-1`}
      style={{
        backgroundColor: color,
      }}
    >
      {children}
    </span>
  );
};

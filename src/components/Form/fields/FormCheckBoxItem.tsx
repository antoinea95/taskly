import { Checkbox } from "../../ui/checkbox";
import { FormCheckBoxItemProps } from "../../types/form.types";

/**
 * FormCheckBoxItem is a reusable component for rendering a checkbox with an associated label.
 * It accepts `id`, `defaultChecked`, `onCheckedChange`, and `content` as its props to configure the checkbox behavior and appearance.
 *
 * @param {Object} props - The properties to configure the checkbox.
 * @param {string} props.id - The unique identifier for the checkbox.
 * @param {boolean} [props.defaultChecked] - The initial checked state of the checkbox. Defaults to false if not provided.
 * @param {(checked: boolean) => void} props.onCheckedChange - A callback function that is called when the checkbox is checked or unchecked. Receives the new checked state (`true` or `false`) as an argument.
 * @param {string} props.content - The label or content associated with the checkbox, rendered next to it.
 *
 * @returns The FormCheckBoxItem component.
 */
export const FormCheckBoxItem = ({
  id,
  defaultChecked,
  onCheckedChange,
  content,
  isDone,
}: FormCheckBoxItemProps) => {
  return (
    <div className="flex items-center gap-2">
      <Checkbox
        id={id}
        defaultChecked={defaultChecked}
        onCheckedChange={onCheckedChange}
        className="border-2 shadow-none flex items-center justify-center"
      />
      <label
        htmlFor={id}
        className={`pl-1 cursor-pointer text-xs font-medium mr-1 ${isDone ? "line-through" : ""}`}
      >
        {content}
      </label>
    </div>
  );
};

import { Input } from "../ui/input";

/**
 * A SearchBar component that renders a text input for filtering tasks by title.
 * 
 * @component
 * @param {Object} props - The component props.
 * @param {function(React.ChangeEvent<HTMLInputElement>): void} props.handleFilteredTasks - A callback function triggered on input change to filter tasks based on the entered value.
 * 
 */
export const SearchBar = ({ handleFilteredTasks }: { handleFilteredTasks: (e: React.ChangeEvent<HTMLInputElement>) => void }) => {
  return (
      <Input
        type="text"
        onChange={handleFilteredTasks}
        className="rounded-xl border-none shadow-none h-10 bg-gray-100 dark:bg-gray-700 dark:text-gray-300 w-1/2"
        placeholder="Search tasks by title"
      />
  );
};
import { ListType } from "@/utils/types/lists.types";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Trash } from "lucide-react";

/**
 * A visual representation of a draggable list overlay for use during drag-and-drop interactions.
 * This component is rendered as a "ghost" overlay while a list is being dragged.
 *
 * @param {ListType} props.list - The list object containing the list title and tasks to display.
 *
 */
export const DragOverlayList = ({ list }: { list: ListType }) => {
  return (
    <Card className="w-fit md:min-w-96 min-w-72 mb-2 rounded-xl animate-top-to-bottom opacity-30">
      <section className="md:min-w-96 w-fit min-w-72 p-3 rounded-xl bg-gray-50 space-y-3 dark:bg-gray-900">
        <CardHeader className="space-y-3">
          <div className="flex justify-between items-center">
            <CardTitle>{list.title}</CardTitle>
            <span className="rounded-xl flex gap-2 shadow-none hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-600">
              <Trash size={16} />
            </span>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {Array.from({ length: list.tasks.length }).map((_, index) => (
            <Card key={index} className="w-full h-32 bg-gray-300"></Card>
          ))}
        </CardContent>
      </section>
    </Card>
  );
};

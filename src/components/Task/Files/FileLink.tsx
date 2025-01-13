import { useDeleteTaskFile } from "@/utils/helpers/hooks/useDeleteTaskFile";
import { TaskFileType } from "@/utils/types/tasks.types";
import { DownloadLink } from "./DownloadLink";
import { DeleteFile } from "./DeleteFile";

/**
 * Renders a file link with an option to delete the file.
 * The component displays the file name, provides a link to open the file,
 * and includes a delete button with confirmation.
 *
 * @param {Object} props - The props for the FileLink component.
 * @param {string} props.taskId - The ID of the task associated with the file.
 * @param {TaskFileType} props.file - The file information, including its name and URL.
 *
 */
export const FileLink = ({ taskId, file }: { taskId: string; file: TaskFileType }) => {
  const { handleFileDelete, deleteFileFromTask } = useDeleteTaskFile(taskId, file.name);
  return (
    <div className="rounded-xl flex items-center justify-center gap-2 bg-gray-100 dark:bg-gray-600 w-fit px-3 py-2" key={file.name}>
      <p className="text-sm mr-4">{file.name.split("_").slice(1).join("_")}</p>
      <DownloadLink file={file} />
      <DeleteFile handleFileDelete={handleFileDelete} deleteFileFromTask={deleteFileFromTask} />
    </div>
  );
};

import { TaskFileType } from "@/utils/types/tasks.types";
import { Download } from "lucide-react";

/**
 * Return a link with a dowload icon, allow the user to open and download the file in a new tab
 * @param props
 * @param {TaskFileType} props.file - The file to display
 */
export const DownloadLink = ({file}: {file: TaskFileType}) => {

    return (
        <a
        href={file.url}
        target="_blank"
        download={file.name}
        className=" p-2.5 inline-flex bg-gray-100 text-black rounded-xl hover:bg-gray-300 transition-colors"
      >
        <Download size={16} />
      </a>
    )
}
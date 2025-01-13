import { TaskFileType } from "@/utils/types/tasks.types";
import { useMemo, useState } from "react";
import { FilesImagesCarousel } from "./FilesImagesCarousel";
import { File, Image } from "lucide-react";
import { FileLink } from "./FileLink";

/**
 * Displays the task files, separating images and non-image files.
 * Allows users to preview images in a carousel and access non-image files as links.
 * 
 * @param {Object} props - The props for the TaskFiles component.
 * @param {string} props.taskId - The ID of the task associated with the files.
 * @param {TaskFileType[]} props.files - The list of files attached to the task.
 *
 */
export const TaskFiles = ({ taskId, files }: { taskId: string; files: TaskFileType[] }) => {

  // Sort between images and files
  const images = useMemo(() => files.filter((file) => file.type.includes("image")), [files]);
  const filesNonImage = useMemo(() => files.filter((file) => !file.type.includes("image")), [files]);

  // keep track of the active image to navigate and open carousel
  const [activeImageIndex, setActiveImageIndex] = useState<number | null>(null);
  const handleOpenCarousel = (index: number) => {
    setActiveImageIndex(index);
  };

  return (
    <div className="space-y-6">
      {images.length > 0 && (
        <div className="flex flex-col gap-3">
          <h3 className="flex items-center gap-2 font-medium">
            <Image size={20} />
            Images
          </h3>
          <div className="grid grid-cols-5 items-center gap-4 flex-wrap">
            {images.map((image, index) => (
              <div
                className="w-16 h-16 rounded-xl overflow-hidden flex items-center justify-center bg-black cursor-pointer hover:scale-105 transition-transform"
                key={image.name}
                onClick={() => handleOpenCarousel(index)}
              >
                <img src={image.url} className="object-cover w-full" />
              </div>
            ))}
            {activeImageIndex !== null && (
              <FilesImagesCarousel taskId={taskId} images={images} activeImageIndex={activeImageIndex} setActiveImageIndex={setActiveImageIndex} />
            )}
          </div>
        </div>
      )}
      {filesNonImage.length > 0 && <div className="flex flex-col gap-3">
        <h3 className="flex items-center gap-2 font-medium">
          <File size={20} />
          Attached files
        </h3>
        <div className="flex items-center gap-4 flex-wrap">
          {filesNonImage.map((file) => (
            !file.type.includes("image") ? <FileLink taskId={taskId} file={file} key={file.name} /> : null
          ))}
        </div>
      </div>}
    </div>
  );
};

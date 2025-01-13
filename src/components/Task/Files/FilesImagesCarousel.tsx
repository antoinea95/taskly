import { TaskFileType } from "@/utils/types/tasks.types";
import { Dispatch, SetStateAction, useEffect } from "react";
import { ChevronLeft, ChevronRight, Download, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDeleteTaskFile } from "@/utils/helpers/hooks/useDeleteTaskFile";
import { DeleteFile } from "./DeleteFile";


/**
 * Renders an image carousel for task files. 
 * Allows navigation between images, file download, and file deletion.
 * 
 * @param {Object} props - The props for the FilesImagesCarousel component.
 * @param {string} props.taskId - The ID of the task associated with the images.
 * @param {TaskFileType[]} props.images - The list of task files to display as images in the carousel.
 * @param {number} props.activeImageIndex - The index of the currently active image.
 * @param {Dispatch<SetStateAction<number | null>>} props.setActiveImageIndex - State setter to update the active image index or close the carousel.
 *
 */
export const FilesImagesCarousel = ({
  taskId,
  images,
  activeImageIndex,
  setActiveImageIndex,
}: {
  taskId: string;
  images: TaskFileType[];
  activeImageIndex: number;
  setActiveImageIndex: Dispatch<SetStateAction<number | null>>;
}) => {

  const {handleFileDelete, deleteFileFromTask} = useDeleteTaskFile(taskId, images[activeImageIndex].name, setActiveImageIndex)
 

  const handleImageNext = () => {
    setActiveImageIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex! + 1));
  };

  const handleImagePrev = () => {
    setActiveImageIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex! - 1));
  };

  const handleCloseModal = () => {
    setActiveImageIndex(null);
  };

    /**
   * Listens for keyboard events to navigate the carousel or close it.
   * - ArrowLeft: Moves to the previous image.
   * - ArrowRight: Moves to the next image.
   * - Escape: Closes the carousel.
   */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowLeft":
          setActiveImageIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex! - 1));
          break;
        case "ArrowRight":
          setActiveImageIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex! + 1));
          break;
        case "Escape":
          setActiveImageIndex(null);
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [images, setActiveImageIndex]);

  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[95%] h-[90%] bg-black flex items-center justify-center rounded-xl">
      <Button className="absolute -translate-y-1/2 left-3 top-1/2" size="icon" variant="secondary" onClick={handleImagePrev}>
        <ChevronLeft size={16} />
      </Button>
      <div className="w-3/4 h-auto overflow-hidden rounded-xl">
        <img src={images[activeImageIndex].url} className="object-cover w-full h-full" />
      </div>
      <Button className="absolute -translate-y-1/2 right-3 top-1/2" variant="secondary" size="icon" onClick={handleImageNext}>
        <ChevronRight size={16} />
      </Button>
      <Button onClick={handleCloseModal} className="absolute top-3 right-3" size="icon" variant="secondary">
        <X size={16} />
      </Button>
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2">
        <a
          href={images[activeImageIndex].url}
          target="_blank"
          download={images[activeImageIndex].name}
          className=" p-2.5 inline-flex bg-gray-100 text-black rounded-xl hover:bg-gray-300 transition-colors"
        >
          <Download size={16} />
        </a>
        <DeleteFile handleFileDelete={handleFileDelete} deleteFileFromTask={deleteFileFromTask} />
      </div>
    </div>
  );
};

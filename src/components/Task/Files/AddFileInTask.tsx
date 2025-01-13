import { Input } from "@/components/ui/input";
import { ChangeEvent, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { File as FileIcon, X } from "lucide-react";
import { NotificationBanner } from "@/components/Notification/NotificationBanner";
import { useUploadFileInTask } from "@/utils/hooks/FirestoreHooks/mutations/useUploadFileInTask";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { SubmitButton } from "@/components/Button/SubmitButton";
import { useQueryClient } from "@tanstack/react-query";
import { TaskFileType } from "@/utils/types/tasks.types";

/**
 * Add a button in tasks actions part, this component allow user to import file in task, preview image and rename file name,
 * handle file duplication by controling file name before import
 * @param props
 * @param {string} props.taskId - The id of the current task
 * @param {TaskFileType[]} props.files - An array wich contains the files of the tasks
 * 
 */
export const AddFileInTask = ({ taskId, files }: { taskId: string, files?: TaskFileType[] }) => {

  // Save the current file and handle preview URL
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Save the new name
  const [newFileName, setNewFileName] = useState<string | null>(null);
  const [sameFileError, setSameFileError] = useState<string | null>(null)
  const importFile = useUploadFileInTask(["tasks"], file, taskId);
  const queryClient = useQueryClient();

  const form = useForm();


  /**
   * Handle renaming file, add taskId before the fileName and update the current file in state
   * @param fileName - name of the file
   * @param file - current file
   * @returns the renamed File object
   */
  const handleRenamedFile = (fileName: string, file: File) => {
    const renamedFile = new File([file], `${taskId}_${fileName}`, {
      type: file.type
    });
    setFile(renamedFile);
    return renamedFile;
  }

  /**
   * Handles file input change, setting the file and generating a preview URL.
   *
   * @param {ChangeEvent<HTMLInputElement>} e - The change event from the file input.
   */
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const fileUpload = e.target.files?.[0];
    if (fileUpload) {
      const renamedFile = handleRenamedFile(fileUpload.name, fileUpload);
      const objectUrl = URL.createObjectURL(renamedFile);
      if (fileUpload.type.includes("image")) {
        setPreviewUrl(objectUrl);
      }
    }
  };

  /**
   * When a file other than an image is imported, user can rename it
   * @param e - The change event of the input
   */
  const handleChangeFileName = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileName = e.target.value;
    setNewFileName(fileName);
  };

  /**
   * Set the new file when the user change its name
   */
  const handleBlurFileName = () => {
    if (file && newFileName) {
      const extension = file.name.split(".").pop();
      const newName = `${newFileName}.${extension}`;
      handleRenamedFile(newName, file);
    }
  };

  /**
   * Handles file upload when the user submits the form.
   * It triggers the mutation to upload the file to the server.
   *
   * @returns - Returns a promise indicating the file upload process.
   */
  const handleFileUpload = async () => {
    const isFileAlreadyImport = files && files.length > 0 ? files.some((fileFromDb) => fileFromDb.name === file?.name) : false;
    if(isFileAlreadyImport) {
      setSameFileError(`File with name ${file?.name} already exists`);
      return;
    }
    await importFile.mutateAsync(undefined, {
      onSuccess: () => {
        setNewFileName(null)
        queryClient.invalidateQueries({queryKey: ["tasks"]})
      }
    });
    setPreviewUrl(null);
    setFile(null);
  };

  /**
   * Reset sameFileError state after 3s
   */
  useEffect(() => {
    if(sameFileError) {
      const timeOut = setTimeout(() => setSameFileError(null), 3000);
      return () => clearTimeout(timeOut)
    }
  }, [sameFileError]);


  /**
   * Cleans up the preview URL when the component is unmounted to free up memory.
   */
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  return (
    <div className="w-full rounded-xl bg-zinc-100 flex flex-col items-center">
      {file ? (
        <div className="flex items-center gap-2 w-full justify-center pt-3 px-3">
          {previewUrl ? (
            <div className="rounded-xl overflow-hidden max-h-60  flex items-center justify-center">
              <img src={previewUrl} className="object-cover w-full h-full" />
            </div>
          ) : (
            <Input type="text" onChange={handleChangeFileName} onBlur={handleBlurFileName} defaultValue={file.name.split("_").slice(1).join("_")} className="bg-gray-200 border-none" />
          )}
        </div>
      ) : (
        <Button
          type="button"
          variant="secondary"
          className=" hover:bg-gray-200 rounded-xl shadow-none w-full dark:bg-gray-800 dark:text-gray-300 transition-transform overflow-hidden p-0 h-fit"
        >
          <Label htmlFor="files" className="cursor-pointer flex items-center justify-center gap-2 w-full p-2.5">
            <FileIcon size={16} /> Add a file
          </Label>
        </Button>
      )}

      <form onSubmit={form.handleSubmit(handleFileUpload)} className="space-y-3 w-full">
        <Input
          id="files"
          type="file"
          accept="image/png, image/jpeg, image/gif, image/bmp, .svg, .pdf, .csv, .xlsx, .ods, .doc, .docx, .pages"
          onChange={handleFileChange}
          className="bg-gray-200 border-non shadow-none rounded-xl cursor-pointer dark:bg-gray-300 hidden"
        />
        {file && (
          <div className="flex items-center gap-3 p-3">
            <SubmitButton isPending={importFile.isPending}>Upload File</SubmitButton>
            <Button
              onClick={() => {
                setFile(null);
                setPreviewUrl(null);
              }}
              type="button"
              variant="secondary"
              size="icon"
              aria-label="Cancel"
              className="shadow-none rounded-xl hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-600"
            >
              <X size={16} />
            </Button>
          </div>
        )}

        <NotificationBanner isError={importFile.isError || !!sameFileError} content={importFile.error ? importFile.error?.message : sameFileError ? sameFileError : ""} />
      </form>
    </div>
  );
};

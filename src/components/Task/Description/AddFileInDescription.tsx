import { Input } from "@/components/ui/input";
import { ChangeEvent, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { File as FileIcon, X } from "lucide-react";
import { NotificationBanner } from "@/components/Notification/NotificationBanner";
import { useUploadFileInTask } from "@/utils/hooks/FirestoreHooks/mutations/useUploadFileInTask";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { SubmitButton } from "@/components/Button/SubmitButton";

/**
 * Component that allows users to update their profile picture.
 * It shows the current profile picture and allows the user to upload a new one.
 *
 * @param {Object} props - Component properties.
 * @param {UserType} props.user - The user object containing user details, including photoURL.
 */
export const AddFileInDescription = ({ taskId }: { taskId: string }) => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const importFile = useUploadFileInTask(["tasks"], file, taskId);

  const form = useForm();

  /**
   * Handles file input change, setting the file and generating a preview URL.
   *
   * @param {ChangeEvent<HTMLInputElement>} e - The change event from the file input.
   */
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const fileUpload = e.target.files?.[0];
    if (fileUpload) {
      const renamedFile = new File([fileUpload], `${taskId}_${fileUpload.name}`, {
        type: fileUpload.type,
      });
      setFile(renamedFile);

      const objectUrl = URL.createObjectURL(renamedFile);
      if (fileUpload.type.includes("image")) {
        setPreviewUrl(objectUrl);
      }
    }
  };

  /**
   * Handles file upload when the user submits the form.
   * It triggers the mutation to upload the file to the server.
   *
   * @returns - Returns a promise indicating the file upload process.
   */
  const handleFileUpload = async () => {
    await importFile.mutateAsync();
    setPreviewUrl(null);
    setFile(null);
  };

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
            <span>{file.name.split("_").slice(1).join("_")}</span>
          )}
        </div>
      ) : (
        <Button
          type="button"
          variant="secondary"
          className=" hover:bg-gray-200 rounded-xl shadow-none w-full dark:bg-gray-800 dark:text-gray-300 transition-transform"
        >
          <Label htmlFor="files" className="cursor-pointer flex items-center justify-center gap-2 w-full">
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

        <NotificationBanner isError={importFile.isError} content={importFile.error ? importFile.error?.message : ""} />
      </form>
    </div>
  );
};

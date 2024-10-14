import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { useUploadProfilePic } from "@/utils/hooks/FirestoreHooks/mutations/useUploadProfilePic";
import { UserType } from "@/utils/types/auth.types";
import { useQueryClient } from "@tanstack/react-query";
import { ChangeEvent, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { FormActionsButton } from "../Form/actions/FormActionsButton";
import { NotificationBanner } from "../Notification/NotificationBanner";
import { ToggleButton } from "../Button/ToggleButton";
import { File as FileIcon } from "lucide-react";

/**
 * Component that allows users to update their profile picture.
 * It shows the current profile picture and allows the user to upload a new one.
 *
 * @param {Object} props - Component properties.
 * @param {UserType} props.user - The user object containing user details, including photoURL.
 */
export const UpdatePicture = ({ user }: { user: UserType }) => {
  const [isUpdate, setIsUpdate] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const importFile = useUploadProfilePic(["users"], file, user.id);
  const queryClient = useQueryClient();

  const form = useForm();

  /**
   * Handles file input change, setting the file and generating a preview URL.
   *
   * @param {ChangeEvent<HTMLInputElement>} e - The change event from the file input.
   */
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const fileUpload = e.target.files?.[0];
    if (fileUpload) {
      const renamedFile = new File([fileUpload], user.id, {
        type: fileUpload.type,
      });
      setFile(renamedFile);

      const objectUrl = URL.createObjectURL(renamedFile);
      setPreviewUrl(objectUrl);
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
    queryClient.invalidateQueries({ queryKey: ["user", user.id] });
    setIsUpdate(false);
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
    <div className="flex flex-col justify-center items-center gap-3 w-fit col-span-7">
      <Avatar className="w-32 h-32 rounded-full border-2 border-black">
        <AvatarImage
          src={previewUrl ? previewUrl : user?.photoURL}
          className="object-cover bg-white"
        />
        <AvatarFallback className="bg-white text-4xl flex items-center justify-center">
          {user.name.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      {isUpdate ? (
        <form
          onSubmit={form.handleSubmit(handleFileUpload)}
          className="space-y-3"
        >
          <Input
            id="profile"
            type="file"
            accept="image/png, image/jpg, image/jpeg"
            onChange={handleFileChange}
            className="bg-gray-200 border-non shadow-none rounded-xl cursor-pointer dark:bg-gray-300"
          />
          <FormActionsButton
            isPending={importFile.isPending}
            setIsOpen={setIsUpdate}
          >
            <span className="flex items-center gap-2">
              <FileIcon size={16} /> Update profile picture
            </span>
          </FormActionsButton>
          <NotificationBanner
            isError={importFile.isError}
            content={importFile.error ? importFile.error?.message : ""}
          />
        </form>
      ) : (
        <div className="space-y-3 w-full">
          <ToggleButton setIsOpen={setIsUpdate}>Update picture</ToggleButton>
          <NotificationBanner
            isSuccess={importFile.isSuccess}
            content={importFile.isSuccess ? "Picture successfully updated" : ""}
          />
        </div>
      )}
    </div>
  );
};

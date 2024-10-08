import { CloseButton } from "@/components/Button/CloseButton";
import { SubmitButton } from "@/components/Button/SubmitButton";
import { ToggleButton } from "@/components/Button/ToggleButton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { useUploadProfilePic } from "@/firebase/mutateHook";
import { UserType } from "@/utils/types";
import { useQueryClient } from "@tanstack/react-query";
import { ChangeEvent, useState, useEffect } from "react";
import { useForm } from "react-hook-form";

export const UpdatePicture = ({ user }: { user: UserType }) => {
  const [isUpdate, setIsUpdate] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const importFile = useUploadProfilePic("users", file, user.id);
  const queryClient = useQueryClient();

  const form = useForm();

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

  const handleFileUpload = async () => {
    if (file) {
      await importFile.mutateAsync();
      queryClient.invalidateQueries({queryKey: ["user", user.id]})
      setIsUpdate(false)
    }
  };

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
            className="object-cover bg-gray-200"
          />
          <AvatarFallback className="bg-gray-200 text-4xl flex items-center justify-center">
            {user.name.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        {isUpdate ? (
          <form onSubmit={form.handleSubmit(handleFileUpload)} className="space-y-3">
            <Input
              id="profile"
              type="file"
              accept="image/png, image/jpg, image/jpeg"
              onChange={handleFileChange}
              className="bg-gray-200 border-non shadow-none rounded-xl cursor-pointer"
            />
            <div className="flex items-center gap-2">
            <SubmitButton isLoading={importFile.isPending}>Send</SubmitButton>
            <CloseButton setIsOpen={setIsUpdate}/>
            </div>
          </form>
        ) : (
          <ToggleButton setIsOpen={setIsUpdate}>Update picture</ToggleButton>
        )}
      </div>
  );
};

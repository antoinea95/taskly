import { UpdatePassword } from "@/components/Auth/UpdatePassword";
import { DeleteButton } from "@/components/Button/DeleteButton";
import { DeleteConfirmation } from "@/components/Form/actions/DeleteConfirmation";
import { FormContainer } from "@/components/Form/containers/FormContainer";
import { UpdatePicture } from "@/components/Profile/UpdatePicture";
import { UserType } from "@/components/types/auth.types";
import { FormFieldItemType } from "@/components/types/form.types";
import { Skeleton } from "@/components/ui/skeleton";
import { useUpdateEmail } from "@/utils/hooks/FirestoreHooks/auth/updateUser";
import { useAuth } from "@/utils/hooks/FirestoreHooks/auth/useAuth";
import { useDeleteAccount } from "@/utils/hooks/FirestoreHooks/auth/useDeleteAccount";
import { useReauthWithPassword } from "@/utils/hooks/FirestoreHooks/auth/useReauth";
import { useUpdateDoc } from "@/utils/hooks/FirestoreHooks/mutations/useUpdateDoc";
import { useMutation } from "@tanstack/react-query";
import { getAuth, updateEmail, User } from "firebase/auth";
import { useEffect, useState } from "react";
import { FieldValues } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

export const ProfilePage = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const user = getAuth().currentUser;
  const [formContent, setFormContent] = useState<FormFieldItemType[]>([]);
  const [isNeedPassword, setIsNeedPassword] = useState(false);
  const updateUser = useUpdateDoc<Partial<UserType>>(
    ["user", currentUser?.id],
    "users",
    currentUser?.id
  );

  const isGoogle = user?.providerData.some(
    (item) => item.providerId === "google.com"
  );
  const deleteAccount = useDeleteAccount(currentUser?.id!, () => {
    navigate("/login");
  });
  const updateEmail = useUpdateEmail<{userId: string, email: string}>(() => setIsNeedPassword(false));

  const userSchema = z.object({
    name: z.string().min(2).optional(),
    email: z.string().email().optional(),
    password: z.string().min(8).optional(),
  });

  const handleUpdateUser = async (data: FieldValues) => {
    try {

      if(data.email && currentUser) {
        await updateEmail.mutateAsync({userId: currentUser.id, email: data.email})
      }

      const updateData: Partial<UserType> = {};
      if (data.name) updateData.name = data.name;
      if (data.email) updateData.email = data.email;

      updateUser.mutate(
        {
          ...updateData,
        },
        {
          onSuccess: () => {
            setIsNeedPassword(false);
          },
        }
      );
    } catch (error: any) {
      console.error("Erreur during profile update :", error.code);
      setIsNeedPassword(true);
    }
  };

  useEffect(() => {
    if (currentUser) {
      let updatedFormContent: FormContent = [
        {
          name: "name",
          type: "text",
          placeholder: "John Doe",
          label: "Name",
          value: currentUser.name,
        },
        {
          name: "email",
          type: "email",
          placeholder: "john@doe.com",
          label: "E-mail",
          value: currentUser.email,
        },
      ];

      if (isGoogle) {
        updatedFormContent = updatedFormContent.filter(
          (item) => item.name !== "email"
        );
      }

      if (isNeedPassword) {
        updatedFormContent.push({
          name: "password",
          type: "password",
          placeholder: "********",
          label: "Please provide your password",
        });
      }

      setFormContent(updatedFormContent);
    }
  }, [currentUser, isGoogle, isNeedPassword, updateUser.isSuccess]);

  return (
    <>
      {currentUser ? (
        <main className="flex-1 flex flex-col font-outfit">
          <h1 className="text-4xl uppercase px-3 py-2">{currentUser.name}</h1>
          <section className="flex flex-col items-center space-y-3 w-full">
            <UpdatePicture user={currentUser} />
            <div className="p-3 rounded-xl bg-white w-1/2 space-y-3">
              <FormContainer>
                
              </FormContainer>
              <CreateForm<UserType>
                schema={userSchema}
                onSubmit={onSubmit}
                query={updateUser}
                formContent={formContent}
                buttonName="Update Profile"
              />
            </div>
            <div className="space-y-3 w-1/2 pt-2">
              {!isGoogle && <UpdatePassword />}
              <DeleteButton>
                {({setIsOpen}) => (
                  <DeleteConfirmation setIsOpen={setIsOpen} actionName="account" handleDelete={deleteAccount.mutateAsync} isPending={deleteAccount.isPending} />
                )}
              </DeleteButton>
            </div>
          </section>
        </main>
      ) : (
        <Skeleton />
      )}
    </>
  );
};

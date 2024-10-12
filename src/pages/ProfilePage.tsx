import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { FieldValues } from "react-hook-form";
import { UpdatePassword } from "@/components/Auth/UpdatePassword";
import { DeleteButton } from "@/components/Button/DeleteButton";
import { DeleteConfirmation } from "@/components/Form/actions/DeleteConfirmation";
import { FormActionsButton } from "@/components/Form/actions/FormActionsButton";
import { FormContainer } from "@/components/Form/containers/FormContainer";
import { FormFieldInputItem } from "@/components/Form/fields/FormFieldInputItem";
import { UpdatePicture } from "@/components/Profile/UpdatePicture";
import { Skeleton } from "@/components/ui/skeleton";
import { firebaseAuth } from "@/utils/firebase/firebaseApp";
import { useUpdateEmail } from "@/utils/hooks/FirestoreHooks/auth/updateUser";
import { useAuth } from "@/utils/hooks/FirestoreHooks/auth/useAuth";
import { useDeleteAccount } from "@/utils/hooks/FirestoreHooks/auth/useDeleteAccount";
import { useUpdateDoc } from "@/utils/hooks/FirestoreHooks/mutations/useUpdateDoc";
import { UserType } from "@/utils/types/auth.types";
import { FormFieldItemType } from "@/utils/types/form.types";
import { Pen } from "lucide-react";
import { NotificationBanner } from "@/components/Notification/NotificationBanner";
import { useQueryClient } from "@tanstack/react-query";

/**
 * ProfilePage component for managing and updating user profile details.
 * Includes email, name, and password update functionality, as well as account deletion.
 *
 * @returns Rendered Profile Page component.
 */
export const ProfilePage = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const user = firebaseAuth.currentUser;
  const queryClient = useQueryClient();

  const [formContent, setFormContent] = useState<FormFieldItemType[]>([]);
  const [isNeedPassword, setIsNeedPassword] = useState(false);

  // Mutation hook to update user data in Firestore
  const updateUser = useUpdateDoc<Partial<UserType>>(
    ["user", currentUser?.id],
    "users",
    currentUser?.id
  );

  // Check if the user is using Google sign-in
  const isGoogle = user?.providerData.some(
    (item) => item.providerId === "google.com"
  );

  // Hook to update user email
  const updateEmail = useUpdateEmail(() =>
    setIsNeedPassword(false)
  );

  // Hook to delete the user account
  const deleteAccount = useDeleteAccount(() => {
    navigate("/login");
    queryClient.removeQueries();
  });

  // Zod schema to validate form inputs
  const userSchema = z.object({
    name: z.string().min(2).optional(),
    email: z.string().email().optional(),
    password: z.string().min(8).optional(),
  });

  /**
   * Handles the user profile update, including email and name changes.
   *
   * @param {FieldValues} data - The form data containing updated user fields.
   */
  const handleUpdateUser = async (data: FieldValues) => {
    try {
      // Update email if provided
      if (data.email && currentUser) {
        await updateEmail.mutateAsync(data);
      }

      // Prepare the update data
      const updateData: Partial<UserType> = {};
      if (data.name) updateData.name = data.name;
      if (data.email) updateData.email = data.email;

      // Update user data in Firestore
      updateUser.mutate(
        { ...updateData },
        {
          onSuccess: () => setIsNeedPassword(false),
        }
      );
    } catch (error: any) {
      console.error("Error during profile update:", error.code);
      setIsNeedPassword(true);
    }
  };

  // Effect to populate form fields based on current user data
  useEffect(() => {
    if (currentUser) {
      let updatedFormContent: FormFieldItemType[] = [
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

      // Exclude email update if user signed in with Google
      if (isGoogle) {
        updatedFormContent = updatedFormContent.filter(
          (item) => item.name !== "email"
        );
      }

      // Add password field if email is being updated
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
          <header className="flex justify-between w-full items-center">
            <h1 className="text-4xl uppercase px-3 py-2">{currentUser.name}</h1>
            <DeleteButton content="Delete your account">
                {({ setIsOpen }) => (<DeleteConfirmation
                    setIsOpen={setIsOpen}
                    actionName="account"
                    handleDelete={deleteAccount.mutateAsync}
                    isPending={deleteAccount.isPending}
                  />
                )}
              </DeleteButton>
          </header>
          <section className="flex flex-col items-center space-y-10 w-full">
            <UpdatePicture user={currentUser} />
            <div className="w-1/2 space-y-3">
              <FormContainer
                schema={userSchema}
                mutationQuery={updateUser}
                onSubmit={handleUpdateUser}
                defaultValues={{
                  name: currentUser.name,
                  email: currentUser.email,
                }}
              >
                {({ form }) => (
                  <>
                    {formContent.map((item) => (
                      <FormFieldInputItem
                        key={item.name}
                        form={form}
                        item={item}
                      />
                    ))}
                    <FormActionsButton isPending={updateUser.isPending}>
                      <span className="flex items-center gap-2">
                        <Pen size={16} />
                        Update Profile
                      </span>
                    </FormActionsButton>
                    <NotificationBanner isSuccess={updateUser.isSuccess} content={"Profile updated"} />
                  </>
                )}
              </FormContainer>
            </div>
            <div className="space-y-3 w-1/2 pt-2">
              {!isGoogle && <UpdatePassword />}
            </div>
          </section>
        </main>
      ) : (
        <Skeleton />
      )}
    </>
  );
};

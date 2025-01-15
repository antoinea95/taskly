import { useState } from "react";
import { ToggleButton } from "@/components/Button/ToggleButton";
import { z } from "zod";
import { FieldValues } from "react-hook-form";
import { useUpdatePassword } from "@/utils/hooks/FirestoreHooks/auth/updateUser";
import { FormContainer } from "../Form/containers/FormContainer";
import { FormFieldInputItem } from "../Form/fields/FormFieldInputItem";
import { FormActionsButton } from "../Form/actions/FormActionsButton";
import { FormFieldItemType } from "../../utils/types/form.types";
import { NotificationBanner } from "../Notification/NotificationBanner";
import { Lock } from "lucide-react";

/**
 * UpdatePassword component
 *
 * This component allows users to update their password. It includes fields for the current password,
 * new password, and password confirmation, with validation to ensure the passwords match.
 * The component toggles between showing the form and the button to trigger the password update.
 *
 * @returns The rendered password update form or button.
 */
export const UpdatePassword = () => {
  // Zod schema for validating password fields
  const passwordSchema = z
    .object({
      actualPassword: z.string().min(8), // Minimum length of 8 for the current password
      newPassword: z.string().min(8), // Minimum length of 8 for the new password
      confirmPassword: z.string().min(8), // Minimum length of 8 for password confirmation
    })
    .refine(
      (data) => {
        // Ensure that the new password and confirm password match
        if (data.newPassword && data.confirmPassword) {
          return data.newPassword === data.confirmPassword;
        }
        return true;
      },
      {
        message: "Passwords don't match",
        path: ["confirmPassword"],
      }
    );

  // State to toggle between showing the form or not
  const [isUpdatePassword, setIsUpdatePassword] = useState(false);

  // Custom hook to handle password update logic
  const updatePassword = useUpdatePassword<z.infer<typeof passwordSchema>>(() => {
    setIsUpdatePassword(false);
  });

  // Form content definition
  const formContent: FormFieldItemType[] = [
    {
      name: "actualPassword",
      type: "password",
      placeholder: "*********",
      label: "Actual password",
    },
    {
      name: "newPassword",
      type: "password",
      placeholder: "*********",
      label: "Password",
    },
    {
      name: "confirmPassword",
      type: "password",
      placeholder: "*********",
      label: "Confirm password",
    },
  ];

  /**
   * Handles the password update process by submitting the form data.
   *
   * @param {FieldValues} data - The form data, containing the current and new passwords.
   * @returns A promise that resolves when the password update is completed.
   */
  const handleUpdatePassword = async (data: FieldValues) => {
    // Call the mutateAsync method to trigger password update
    await updatePassword.mutateAsync({
      ...(data as z.infer<typeof passwordSchema>), // Cast the form data to match the schema
    });
  };

  return (
    <div className="flex flex-col items-center">
      {isUpdatePassword ? (
        <FormContainer schema={passwordSchema} onSubmit={handleUpdatePassword} mutationQuery={updatePassword}>
          {({ form }) => (
            <>
              {/* Render the form fields */}
              {formContent.map((item) => {
                if (item.hidden) return;
                return <FormFieldInputItem key={item.name} form={form} item={item} />;
              })}
              <FormActionsButton isPending={updatePassword.isPending} setIsOpen={setIsUpdatePassword} disabled={updatePassword.isPending}>
                <span className="flex items-center gap-2">
                  <Lock size={16} />
                  Update password
                </span>
              </FormActionsButton>
            </>
          )}
        </FormContainer>
      ) : (
        <div className="space-y-3 w-full">
          <ToggleButton setIsOpen={setIsUpdatePassword}>
            <Lock size={16} /> Update Password
          </ToggleButton>
          <NotificationBanner isSuccess={updatePassword.isSuccess} content={updatePassword.isSuccess ? "Password updated" : ""} />
        </div>
      )}
    </div>
  );
};

import { useState } from "react";
import { ToggleButton } from "@/components/Button/ToggleButton";
import { z } from "zod";
import { FieldValues } from "react-hook-form";
import { useUpdatePassword } from "@/utils/hooks/FirestoreHooks/auth/updateUser";
import { FormContainer } from "../Form/containers/FormContainer";
import { FormFieldInputItem } from "../Form/fields/FormFieldInputItem";
import { FormActionsButton } from "../Form/actions/FormActionsButton";
import { FormFieldItemType } from "../types/form.types";
import { NotificationBanner } from "../Notification/NotificationBanner";

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
  // State to track if the password update is successful
  const [isSuccess, setIsSuccess] = useState(false);

  // Zod schema for validating password fields
  const passwordSchema = z
    .object({
      actualPassword: z.string().min(8),  // Minimum length of 8 for the current password
      password: z.string().min(8),  // Minimum length of 8 for the new password
      confirmPassword: z.string().min(8),  // Minimum length of 8 for password confirmation
    })
    .refine(
      (data) => {
        // Ensure that the new password and confirm password match
        if (data.password && data.confirmPassword) {
          return data.password === data.confirmPassword;
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

  // Form content definition
  const formContent: FormFieldItemType[] = [
    {
      name: "actualPassword",
      type: "password",
      placeholder: "*********",
      label: "Actual password",
    },
    {
      name: "password",
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

  // Custom hook to handle password update logic
  const updatePassword = useUpdatePassword<z.infer<typeof passwordSchema>>(
    () => {
      setIsSuccess(true);  // Set success state to true on successful update
      setIsUpdatePassword(false);  // Hide form after successful update
    }
  );

  /**
   * Handles the password update process by submitting the form data.
   * 
   * @param {FieldValues} data - The form data, containing the current and new passwords.
   * @returns A promise that resolves when the password update is completed.
   */
  const handleUpdatePassword = async (data: FieldValues) => {
    // Call the mutateAsync method to trigger password update
    await updatePassword.mutateAsync({
      ...(data as z.infer<typeof passwordSchema>),  // Cast the form data to match the schema
    });
  };

  return (
    <div className="flex flex-col items-center">
      {isUpdatePassword ? (
        <FormContainer
          schema={passwordSchema}
          onSubmit={handleUpdatePassword}
          mutationQuery={updatePassword}
        >
          {({ form }) => (
            <>
              {/* Render the form fields */}
              {formContent.map((item) => {
                if (item.hidden) return;
                return (
                  <FormFieldInputItem key={item.name} form={form} item={item} />
                );
              })}
              <FormActionsButton
                actionName="Update password"
                isPending={updatePassword.isPending}
                setIsOpen={setIsUpdatePassword}
                disabled={updatePassword.isPending}
              />
              {/* Display status message */}
              <NotificationBanner
                isError={updatePassword.isError}
                isSuccess={updatePassword.isSuccess}
                content={
                  isSuccess
                    ? "ProfileUpdated"
                    : updatePassword.error instanceof Error &&
                        !updatePassword.error.message.includes(
                          "auth/requires-recent-login"
                        )
                      ? updatePassword.error.message
                      : ""
                }
              />
            </>
          )}
        </FormContainer>
      ) : (
        <ToggleButton setIsOpen={setIsUpdatePassword}>
          Change Password
        </ToggleButton>
      )}
    </div>
  );
};

import { FieldValues } from "react-hook-form";
import { Dispatch, SetStateAction } from "react";
import { z } from "zod";
import { FormContainer } from "../Form/containers/FormContainer";
import { FormFieldInputItem } from "../Form/fields/FormFieldInputItem";
import { FormActionsButton } from "../Form/actions/FormActionsButton";
import { useReauthWithPassword } from "@/utils/hooks/FirestoreHooks/auth/useReauth";

/**
 * ReAuthForm component
 * 
 * This component handles re-authentication using a password form.
 * It uses Zod for schema validation and React Hook Form for form handling.
 * 
 * @param {Object} props - Component properties.
 * @param {Dispatch<SetStateAction<boolean>>} props.setIsNeedPassword - Function to set the state indicating if password input is needed.
 * @returns The rendered re-authentication form.
 */
export const ReAuthForm = ({
  setIsNeedPassword,
}: {
  setIsNeedPassword: Dispatch<SetStateAction<boolean>>;
}) => {
  // Schema validation for the password field using Zod
  const passwordSchema = z.object({
    password: z.string().min(8),
  });

  // Hook to handle password-based reauthentication
  const reauthWithPassword = useReauthWithPassword<
    z.infer<typeof passwordSchema>
  >(() => setIsNeedPassword(false));

  /**
   * Handles user re-authentication by submitting the form data.
   * 
   * @param {FieldValues} data - Form data containing the password.
   * @returns {Promise<void>} A promise that resolves when re-authentication completes.
   */
  const handleReauthUser = async (data: FieldValues) => {
    try {
      reauthWithPassword.mutate(data.password);
    } catch (error) {
      console.error("Authentication error:", error);
    }
  };

  return (
    <FormContainer
      schema={passwordSchema}
      onSubmit={handleReauthUser}
      mutationQuery={reauthWithPassword}
    >
      {({ form }) => (
        <>
          <FormFieldInputItem
            form={form}
            item={{
              name: "password",
              type: "password",
              placeholder: "********",
            }}
          />
          <FormActionsButton
            isPending={reauthWithPassword.isPending}
            actionName="Submit"
          />
        </>
      )}
    </FormContainer>
  );
};

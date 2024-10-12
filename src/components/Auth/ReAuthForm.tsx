import { FieldValues } from "react-hook-form";
import { Dispatch, SetStateAction } from "react";
import { z } from "zod";
import { FormContainer } from "../Form/containers/FormContainer";
import { FormFieldInputItem } from "../Form/fields/FormFieldInputItem";
import { FormActionsButton } from "../Form/actions/FormActionsButton";
import { useReauthWithGoogle, useReauthWithPassword } from "@/utils/hooks/FirestoreHooks/auth/useReauth";
import { LogIn } from "lucide-react";
import { firebaseAuth } from "@/utils/firebase/firebaseApp";
import { Button } from "../ui/button";
import { FcGoogle } from "react-icons/fc";

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
  const user = firebaseAuth.currentUser;

  // Check if the user is using Google sign-in
  const isGoogle = user?.providerData.some(
    (item) => item.providerId === "google.com"
  );

  // Schema validation for the password field using Zod
  const passwordSchema = z.object({
    password: z.string().min(8),
  });

  // Hook to handle password-based reauthentication
  const reauthWithPassword = useReauthWithPassword(() =>
    setIsNeedPassword(false)
  );

  const reauthWithGoogle = useReauthWithGoogle(() => setIsNeedPassword(false));

  /**
   * Handles user re-authentication by submitting the form data.
   *
   * @param {FieldValues} data - Form data containing the password.
   * @returns A promise that resolves when re-authentication completes.
   */
  const handleReauthUser = async (data: FieldValues) => {
    try {
      reauthWithPassword.mutate(data);
    } catch (error) {
      console.error("Authentication error:", error);
    }
  };

  return (
    <>
      {!isGoogle ? (
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
                  label: "Please provide your password",
                }}
              />
              <FormActionsButton isPending={reauthWithPassword.isPending}>
                <span className="flex items-center gap-2">
                  <LogIn size={16} /> Log in
                </span>
              </FormActionsButton>
            </>
          )}
        </FormContainer>
      ) : (
        <div className="w-full">
        <Button
          onClick={() => reauthWithGoogle.mutate()}
          className="uppercase w-full flex items-center py-6 rounded-xl"
        >
          <FcGoogle color="white" style={{ marginRight: "6px" }} /> Google
        </Button>
        </div>
      )}
    </>
  );
};

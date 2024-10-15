import { useState } from "react";
import { z } from "zod";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { FieldValues } from "react-hook-form";
import { useResetPassword } from "@/utils/hooks/FirestoreHooks/auth/updateUser";
import { AuthService } from "@/utils/firebase/auth/authService";
import { FormFieldItemType } from "../../utils/types/form.types";
import { useSign } from "@/utils/hooks/FirestoreHooks/auth/useSign";
import { FormContainer } from "../Form/containers/FormContainer";
import { FormFieldInputItem } from "../Form/fields/FormFieldInputItem";
import { FormActionsButton } from "../Form/actions/FormActionsButton";
import { LogIn, UserPlus } from "lucide-react";
import { NotificationBanner } from "../Notification/NotificationBanner";

/**
 * AuthForm component
 *
 * This component renders a form for user authentication, allowing login, registration,
 * and password reset. It also provides an option to sign in with Google.
 *
 * @returns The authentication form with input fields, Google sign-in option, and reset password functionality.
 */
export const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const sign = useSign();
  const navigate = useNavigate();

  /**
   * User schema validation using Zod
   * Ensures that form inputs are correctly structured and validates password match.
   */
  const UserSchema = z
    .object({
      name: isLogin
        ? z.string().optional()
        : z.string().min(1, "Your name is required"),
      email: z.string().email("Please provide a valid email"),
      password: z
        .string()
        .min(8, "Your password must contain at least 8 characters"),
      confirmPassword: isLogin
        ? z.string().min(8).optional()
        : z.string().min(8),
    })
    .refine(
      (data) => {
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

  /**
   * Form fields configuration based on authentication mode (login or registration).
   */
  const authFormContent: FormFieldItemType[] = [
    { name: "name", type: "text", placeholder: "John Doe", label: "Name" },
    {
      name: "email",
      type: "email",
      placeholder: "johndoe@email.com",
      label: "Email",
    },
    { name: "password", type: "password", placeholder: "", label: "Password" },
    {
      name: "confirmPassword",
      type: "password",
      placeholder: "",
      label: "Confirm your Password",
    },
  ];

  const formContent = authFormContent.map((item) => {
    if ((item.name === "name" || item.name === "confirmPassword") && isLogin) {
      return { ...item, hidden: true };
    }
    return item;
  });

  /**
   * Handles form submission for login or registration.
   *
   * @param {FieldValues} data - The form data containing user inputs.
   */
  const handleAuth = async (data: FieldValues) => {
    const { email, password, name } = data;

    if (email && password) {
      if (isLogin) {
        sign.mutate({ email, password });
      } else {
        sign.mutate({
          email,
          password,
          name: name ?? "",
        });
      }
    } else {
      console.error("Email and password are required");
    }
  };

  /**
   * Handles Google sign-in using Firebase Authentication.
   * Navigates to the homepage upon successful sign-in.
   */
  const signinWithGoogle = async () => {
    try {
      await AuthService.signInWithGoogle();
      navigate("/");
    } catch (error: any) {
      throw new Error(error);
    }
  };

  const resetPassword = useResetPassword<{ email: string }>();

  /**
   * Handles password reset by sending a reset email.
   *
   * @param {string} email - The email address for password reset.
   */
  const handleResetPassword = async (email: string) => {
    try {
      await resetPassword.mutateAsync({ email: email });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center">
      <section className="mb-6 ">
        <h1 className="md:text-4xl text-xl uppercase font-extrabold">
          {!isLogin ? "Create an account" : "Access your boards"}
        </h1>
        <div className="flex items-center gap-2 flex-wrap">
          <p className="text-center">
            {isLogin
              ? "Don't have an account yet?"
              : "Already have an account?"}
          </p>
          <Button
            onClick={() => setIsLogin((prev) => !prev)}
            className="underline w-fit h-fit p-0"
            variant="link"
          >
            {isLogin ? "Create one" : "Log in"}
          </Button>
        </div>
      </section>
      <section className="space-y-3 flex flex-col items-end w-full">
        <FormContainer
          schema={UserSchema}
          onSubmit={handleAuth}
          mutationQuery={sign}
        >
          {({ form }) => (
            <>
              {formContent.map((item) => {
                if (item.hidden) return;
                return (
                  <div className="flex flex-col" key={item.name}>
                    <FormFieldInputItem
                      item={item}
                      form={form}
                    />
                    {item.name === "password" && isLogin && (
                      <Button
                        type="button"
                        onClick={() =>
                          handleResetPassword(form.getValues().email as string)
                        }
                        className="justify-self-end self-end text-xs dark:text-gray-300"
                        variant="link"
                      >
                        Forgot your password ?
                      </Button>
                    )}
                  </div>
                );
              })}
              <FormActionsButton isPending={sign.isPending}>
                <span className="flex items-center gap-2">
                  {isLogin ? <LogIn size={16} /> : <UserPlus size={16} />}
                  {isLogin ? "Log in" : "Create an account"}
                </span>
              </FormActionsButton>
              <NotificationBanner
                isError={resetPassword.isError}
                content={resetPassword.error ? resetPassword.error.message : ""}
              />
            </>
          )}
        </FormContainer>
      </section>
      <section className="mt-3 flex flex-col items-center gap-3 w-full">
        <p className="uppercase flex items-center justify-between text-gray-300 w-full px-3 text-xs md:text-base whitespace-nowrap dark:text-gray-700">
          <span className="border border-gray-100 inline-block w-1/3 dark:border-gray-700"></span> Or
          register with
          <span className="border border-gray-100 inline-block w-1/3 dark:border-gray-700"></span>
        </p>
        <Button
          onClick={signinWithGoogle}
          className="uppercase w-full flex items-center rounded-xl dark:bg-gray-300 dark:text-gray-700"
        >
          <FcGoogle color="white" style={{ marginRight: "6px" }} /> Google
        </Button>
        <p>{isLogin}</p>
      </section>
    </div>
  );
};

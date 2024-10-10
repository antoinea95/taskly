import { useState } from "react";
import { ToggleButton } from "@/components/Button/ToggleButton";
import { FormContent } from "@/utils/types";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/Button/SubmitButton";
import { CloseButton } from "@/components/Button/CloseButton";
import { StatusMessage } from "@/components/Message/StatusMessage";
import { useUpdatePassword } from "@/utils/hooks/FirestoreHooks/auth/updateUser";

export const UpdatePassword = () => {
  const [isSuccess, setIsSuccess] = useState(false);

  const passwordSchema = z
    .object({
      actualPassword: z.string().min(8),
      password: z.string().min(8),
      confirmPassword: z.string().min(8),
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

  const form = useForm<z.infer<typeof passwordSchema>>({
    mode: "onSubmit",
    resolver: zodResolver(passwordSchema),
  });

  const [isUpdatePassword, setIsUpdatePassword] = useState(false);
  type PasswordFieldNames = "actualPassword" | "password" | "confirmPassword";
  const formContent: FormContent<PasswordFieldNames> = [
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

  const { mutateAsync, isError, error } = useUpdatePassword(() => {
    setIsSuccess(true)
    setIsUpdatePassword(false);
  })

  const onSubmit = async (data: z.infer<typeof passwordSchema>) => {
      await mutateAsync({ ...data});
  };

  return (
    <div className="flex flex-col items-center">
      {isUpdatePassword ? (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-3 bg-white p-3 rounded-xl"
          >
            {formContent.map((item, index) => {
              if (item.hidden) return;
              return (
                <FormField
                  key={index}
                  control={form.control}
                  name={item.name}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{item.label}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={""}
                          onChange={field.onChange}
                          type={item.type}
                          className="h-10 rounded-xl bg-gray-200 border-none shadow-none"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              );
            })}
            <div className="flex items-center gap-2">
              <SubmitButton isLoading={false}>
                Update your password
              </SubmitButton>
              <CloseButton setIsOpen={setIsUpdatePassword} />
            </div>
          </form>
          <StatusMessage
            isError={isError}
            isSucess={isSuccess}
            content={
              isSuccess
                ? "ProfileUpdated"
                : error instanceof Error &&
                    !error.message.includes("auth/requires-recent-login")
                  ? error.message
                  : ""
            }
          />
        </Form>
      ) : (
        <ToggleButton setIsOpen={setIsUpdatePassword}>
          Change Password
        </ToggleButton>
      )}
    </div>
  );
};

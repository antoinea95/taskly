import { updatePassword, User } from "firebase/auth";
import { useState } from "react";
import { ToggleButton } from "@/components/Button/ToggleButton";
import { FormContent } from "@/utils/types";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/Button/SubmitButton";
import { CloseButton } from "@/components/Button/CloseButton";

export const UpdatePassword = ({ user }: { user: User | null }) => {

  const passwordSchema = z
    .object({
      password: z.string().min(8).optional(),
      confirmPassword: z.string().min(8).optional(),
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

    const form = useForm({
        mode:"onSubmit",
        resolver:zodResolver(passwordSchema),
    })

  const [isUpdatePassword, setIsUpdatePassword] = useState(false);
  const formContent: FormContent = [
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

  const onSubmit = async (values: z.infer<typeof passwordSchema>) => {
    if(values.password && user) {
        await updatePassword(user, values.password);
        setIsUpdatePassword(false);
      }
  }

  return (
    <>
      {isUpdatePassword ? (
        <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-3 bg-white p-3 rounded-xl">
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
        </Form>
      ) : (
        <ToggleButton setIsOpen={setIsUpdatePassword}>
          Change Password
        </ToggleButton>
      )}
    </>
  );
};

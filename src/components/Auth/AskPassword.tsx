import { useForm } from "react-hook-form";
import { SubmitButton } from "../Button/SubmitButton";
import { Input } from "../ui/input";
import { reauthenticateUser } from "./ReauthUser";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Dispatch, SetStateAction } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { StatusMessage } from "../Message/StatusMessage";

export const AskPassword = ({
  setIsNeedPassword,
}: {
  setIsNeedPassword: Dispatch<SetStateAction<boolean>>;
}) => {
  const schema = z.object({
    password: z.string().min(8),
  });

  const form = useForm<z.infer<typeof schema>>({
    mode: "onSubmit",
    resolver: zodResolver(schema),
  });

  const { mutate, error, isError, isSuccess } = useMutation({
    mutationFn: async (password: string) => await reauthenticateUser(password),
    onSuccess: () => setIsNeedPassword(false),
  });

  const onSubmit = async (data: { password: string }) => {
    try {
      mutate(data.password);
    } catch (error) {
      console.error("Authentication error:", error);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col w-full gap-4 h-fit"
      >
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Please provide your password</FormLabel>
              <FormControl>
                <Input
                  placeholder="********"
                  onChange={field.onChange}
                  type="password"
                  className="h-10 rounded-xl bg-gray-200 border-none shadow-none"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <SubmitButton isLoading={false}>Submit</SubmitButton>
      </form>
      <StatusMessage
        isError={isError}
        isSucess={isSuccess}
        content={
          isSuccess
            ? "User logged successfuly"
            : isError && error instanceof Error
              ? error?.message
              : ""
        }
      />
    </Form>
  );
};

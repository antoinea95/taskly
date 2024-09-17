import { useState } from "react";
import { z } from "zod";
import { CreateForm } from "../Form/CreateForm";
import { useSignIn, useSignUp } from "@/firebase/authHook";

export const AuthForm = () => {

  const SignUpSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email(),
    password: z.string().min(8),
  });
  const signUp = useSignUp();

  const authFormContent = [
    { name: "name", type: "text", placeholder: "John Doe", label: "Name" },
    {
      name: "email",
      type: "email",
      placeholder: "johndoe@email.com",
      label: "Email",
    },
    { name: "password", type: "password", placeholder: "", label: "Password" },
  ];

  const onSubmit = (values: z.infer<typeof SignUpSchema>) => {
      signUp.mutate({
        email: values.email,
        password: values.password,
        name: values.name as string,
      });
    }

  return (
    <main className="w-screen h-screen flex justify-center items-center">
      <div className="flex flex-col border-2 border-black rounded-xl p-10 w-1/2 justify-center items-center">
          <CreateForm
            schema={SignUpSchema}
            onSubmit={onSubmit}
            formContent={authFormContent}
            buttonName="SignIn"
            query={signUp}
          />
          <p className="text-center">
            Already have an account ?{" "}
            <button
              type="button"
              className="font-bold underline"
              onClick={() => setIsLogin(true)}
            >
              Login
            </button>
          </p>
      </div>
    </main>
  );
};

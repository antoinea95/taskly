import { useState } from "react";
import { z } from "zod";
import { Form } from "../Form/Form";
import {useSignIn, useSignUp } from "@/firebase/authHook";

export const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const signIn = useSignIn();
  const signUp = useSignUp()

  const UserSchema = z.object({
    name: isLogin
      ? z.string().optional()
      : z.string().min(1, "Name is required"),
    email: z.string().email(),
    password: z.string().min(8),
  });

  type UserForm = z.infer<typeof UserSchema>;

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

  const formContent = isLogin ? authFormContent.filter((item) => item.name !== "name") : authFormContent;

  const onSubmit = (values: UserForm) => {
    if (isLogin) {
      signIn.mutate({email: values.email, password:values.password});
    } else {
      signUp.mutate({email: values.email, password:values.password, name: values.name as string});;
    }
  };

  return (
    <main className="w-screen h-screen flex justify-center items-center">
      <div className="flex flex-col border-2 border-black rounded-xl p-10 w-1/2 justify-center items-center">
      <Form
        schema={UserSchema}
        onSubmit={onSubmit}
        formContent={formContent}
        buttonName={isLogin ? "Login" : "Signin"}
        isError={isLogin ? signIn.isError : signUp.isError}
        isLoading={isLogin ? signIn.isPending : signUp.isPending}
        error={isLogin ? signIn.error : signUp.error}
      />
      {!isLogin ? (
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
      ) : (
        <p className="text-center mt-4">
          Don't have an account yet ?{" "}
          <button
            type="button"
            className="font-bold underline"
            onClick={() => setIsLogin(false)}
          >
            Signin
          </button>
        </p>
      )}
      </div>
    
    </main>
  );
};

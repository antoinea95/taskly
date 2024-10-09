import { useState } from "react";
import { z } from "zod";
import { CreateForm } from "../Form/CreateForm";
import { SignInData, useSign } from "@/firebase/authHook";
import { FormContent } from "@/utils/types";
import { Button } from "../ui/button";
import FirestoreApi from "@/firebase/FirestoreApi";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { useMutation } from "@tanstack/react-query";
import { StatusMessage } from "../Message/StatusMessage";

export const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const sign = useSign();
  const navigate = useNavigate();

  const UserSchema = z
    .object({
      name: isLogin
        ? z.string().optional()
        : z.string().min(1, "Your name is required"),
      email: z.string().email("Please provide a valid email"),
      password: z
        .string()
        .min(8, "Your password must contain at least 8 characters"),
      confirmPassword: isLogin ? z.string().min(8).optional() : z.string().min(8),
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

  const authFormContent: FormContent = [
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

  const onSubmit = async (data: Partial<SignInData>) => {
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

  const signinWithGoogle = async () => {
    try {
      await FirestoreApi.signInWithGoogle();
      navigate("/");
    } catch (error: any) {
      throw new Error(error);
    }
  };

  const { mutateAsync, isSuccess, isError, error } = useMutation({
    mutationFn: async (variables: { email: string }) => {
      if (variables.email) {
        try {
          await sendPasswordResetEmail(getAuth(), variables.email);
        } catch(error) {
          console.error(error)
          throw new Error("Email does not exist")
        }
      } else {
        throw new Error("Please enter your email");
      }
    },
  });

  const resetPassword = async (email: string) => {
    try {
      await mutateAsync({ email: email });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col w-1/2 justify-center items-center h-screen">
      <section className="w-3/4 mb-6 ">
        <h1 className="text-4xl uppercase font-extrabold">
          {!isLogin ? "Create an account" : "Access your boards"}
        </h1>
        <div className="flex items-center gap-2">
          <p className="text-center">
            {isLogin
              ? "Don't have an account yet?"
              : "Already have an account?"}
          </p>
          <button
            onClick={() => setIsLogin((prev) => !prev)}
            className="font-bold underline"
          >
            {isLogin ? "Create one" : "Log in"}
          </button>
        </div>
      </section>
      <section className="w-3/4 space-y-3 flex flex-col items-end">
        <CreateForm<SignInData>
          schema={UserSchema}
          onSubmit={onSubmit}
          formContent={formContent}
          buttonName={isLogin ? "Log in" : "Create an account"}
          query={sign}
          resetPassword={isLogin ? resetPassword : undefined}
        />
        <StatusMessage
          isError={isError}
          isSucess={isSuccess}
          content={
            isSuccess
              ? "Email sended"
              : isError && error instanceof Error
                ? error?.message
                : ""
          }
        ></StatusMessage>
      </section>
      <section className="w-3/4 mt-6 flex flex-col items-center gap-4">
        <p className="uppercase flex items-center justify-between text-gray-400 w-full">
          <span className="border border-gray-400 inline-block w-1/3"></span> Or
          register with
          <span className="border border-gray-400 inline-block w-1/3"></span>
        </p>
        <Button
          onClick={signinWithGoogle}
          className="uppercase w-full flex items-center py-6 rounded-xl"
        >
          <FcGoogle color="white" style={{ marginRight: "6px" }} /> Google
        </Button>
        <p>{isLogin}</p>
      </section>
    </div>
  );
};

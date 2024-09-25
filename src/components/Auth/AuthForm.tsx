import { useState } from "react";
import { z } from "zod";
import { CreateForm } from "../Form/CreateForm";
import { useSign } from "@/firebase/authHook";
import { FormContent } from "@/utils/types";
import { Button } from "../ui/button";
import FirestoreApi from "@/firebase/FirestoreApi";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";

export const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const sign = useSign();
  const navigate = useNavigate();

  const UserSchema = z.object({
    name: isLogin
      ? z.string().optional()
      : z.string().min(1, "Your name is required"),
    email: z.string().email("Please provide a valid email"),
    password: z
      .string()
      .min(8, "Your password must contain at least 8 characters"),
  });

  type UserForm = {
    name?: string;
    email: string;
    password: string;
  };

  const authFormContent: FormContent = [
    { name: "name", type: "text", placeholder: "John Doe", label: "Name" },
    {
      name: "email",
      type: "email",
      placeholder: "johndoe@email.com",
      label: "Email",
    },
    { name: "password", type: "password", placeholder: "", label: "Password" },
  ];

  const formContent = authFormContent.map((item) => {
    if (item.name === "name" && isLogin) {
      return { ...item, hidden: true };
    }
    return item;
  });

  const onSubmit = async (values: UserForm) => {
    if (isLogin) {
      sign.mutate({ email: values.email, password: values.password });
    } else {
      sign.mutate({
        email: values.email,
        password: values.password,
        name: values.name as string,
      });
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
      <CreateForm
        schema={UserSchema}
        onSubmit={onSubmit}
        formContent={formContent}
        buttonName={isLogin ? "Log in" : "Create an account"}
        query={sign}
      />

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

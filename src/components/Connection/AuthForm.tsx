import { useState } from "react";
import { useAuthStore } from "../../store/authStore";
import { z } from "zod";
import { Form } from "../Form/Form";

export const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { createUser, logIn, status, error } = useAuthStore();

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
      logIn(values.email, values.password);
    } else {
      createUser(values.email, values.password, values.name as string);
    }
  };

  return (
    <main className="w-screen h-screen flex justify-center items-center">
      <div className="flex flex-col border-2 border-black rounded-xl p-10 w-1/2">
      <Form
        schema={UserSchema}
        onSubmit={onSubmit}
        formContent={formContent}
        buttonName={isLogin ? "Login" : "Signin"}
        status={status}
        error={error}
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
        <p className="text-center">
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

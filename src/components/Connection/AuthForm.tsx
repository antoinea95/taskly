import { useState } from "react";
import { useAuthStore } from "../../store/authStore";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "../ui/label";
import { Loader } from "@/components/ui/loader";

export const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { createUser, logIn, status } = useAuthStore();

  const UserSchema = z.object({
    name: isLogin
      ? z.string().optional()
      : z.string().min(1, "Name is required"),
    email: z.string().email(),
    password: z.string().min(8),
  });

  type UserForm = z.infer<typeof UserSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserForm>({
    mode: "onBlur",
    resolver: zodResolver(UserSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: UserForm) => {
    if (isLogin) {
      logIn(values.email, values.password);
    } else {
      createUser(values.email, values.password, values.name as string);
    }
  };


  return (
    <main className="w-screen h-screen flex justify-center items-center">
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="border border-black rounded-xl p-8 w-1/3 flex flex-col gap-8"
    >
      {!isLogin && (
        <div>
          <Label htmlFor="name">Name</Label>
          <Input id="name" {...register("name")} placeholder="John Doe" />
          {errors?.name && (
            <p className="text-red-500 font-bold text-xs my-1">
              {errors.name.message}
            </p>
          )}
        </div>
      )}
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          {...register("email")}
          placeholder="johndoe@email.com"
        />
        {errors?.email && (
          <p className="text-red-500 font-bold text-xs my-1">
            {errors.email.message}
          </p>
        )}
      </div>
      <div>
        <Label htmlFor="password">Password</Label>
        <Input id="password" {...register("password")} type="password" />
        {errors?.password && (
          <p className="text-red-500 font-bold text-xs my-1">
            {errors.password.message}
          </p>
        )}
      </div>
      <Button type="submit">
        {status === "loading" ? <Loader data={{color: "white", size: "6"}} /> : (!isLogin ? "Sign in" : "Login")}
      </Button>
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
    </form>
    </main>
  );
};

import { AuthForm } from "@/components/Auth/AuthForm";

export const LoginPage = () => {
  return (
    <main className="w-screen h-screen flex items-center font-outfit">
      <div className="w-1/2 border-r-2 border-r-black h-screen flex flex-col justify-center items-center gap-16">
        <h1 className="w-3/4 flex justify-center text-6xl font-black uppercase">Welcome to Taskly!</h1>
        <p className="w-3/4 flex justify-center items-center text-lg">
          Welcome to Taskly! Organize, prioritize, and conquer your tasks with
          ease. Taskly is your all-in-one task management tool designed to keep
          your projects on track. Whether you're collaborating with a team or
          managing personal to-do lists, Taskly helps you stay productive and in
          control. Log in now to access your boards, streamline your workflow,
          and turn your ideas into action. Let’s get things done together!
        </p>
      </div>
      <AuthForm />
    </main>
  );
};

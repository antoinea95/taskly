import { AuthForm } from "@/components/Auth/AuthForm";

export const LoginPage = () => {
  return (
    <main className="w-screen h-screen flex items-center flex-wrap gap-10 font-outfit dark:bg-gray-950 dark:text-gray-300 p-10">
      <div className=" md:border-r-2 md:border-r-black flex flex-col justify-center items-center md:gap-16 dark:border-r-gray-300">
        <h1 className="flex justify-center text-3xl md:text-6xl font-black uppercase">Welcome to Taskly!</h1>
        <p className="flex justify-center items-center text-lg">
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

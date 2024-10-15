import { AuthForm } from "@/components/Auth/AuthForm";

export const LoginPage = () => {
  return (
    <main className="h-screen py-10 md:py-0 flex items-center flex-col md:flex-row gap-10 font-outfit dark:bg-gray-950 dark:text-gray-300">
      <div className="h-full md:w-1/2 border-b-2 md:border-r-2 md:border-b-0 border-black flex flex-col justify-center gap-3 dark:border-gray-300">
        <h1 className="text-3xl md:text-6xl font-black uppercase px-10">Welcome to Taskly!</h1>
        <p className="flex justify-center items-center text-lg px-10 py-5 md:px-10">
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

import { AuthForm } from "@/components/Auth/AuthForm";
import { CarouselPresentation } from "@/components/Carousel/CarouselPresentation";
import PageTitle from "@/routes/PageTitle";

export const LoginPage = () => {
  return (
    <main className="h-screen flex flex-col py-20 gap-20 items-center justify-center font-outfit dark:bg-gray-950 dark:text-gray-300">
      <PageTitle title="Taskly: Log in" />
      <h1 className="md:text-6xl text-2xl font-extrabold uppercase">Welcome to Taskly.</h1>
      <div className="m-auto w-[85vw] flex justify-between gap-20 items-start">
      <CarouselPresentation />
      <AuthForm />
      </div>
    </main>
  );
};

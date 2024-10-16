import { AuthForm } from "@/components/Auth/AuthForm";
import { CarouselPresentation } from "@/components/Carousel/CarouselPresentation";
import PageTitle from "@/routes/PageTitle";

export const LoginPage = () => {
  return (
    <main className="h-screen flex flex-col pt-20 gap-10 md:gap-20 items-center lg:justify-center font-outfit dark:bg-gray-950 dark:text-gray-300">
      <PageTitle title="Taskly: Log in" />
      <h1 className="lg:text-6xl text-2xl font-extrabold uppercase">Welcome to Taskly.</h1>
      <div className="m-auto w-[90vw] max-w-screen-2xl flex flex-col items-center lg:flex-row justify-between gap-10 lg:items-start">
      <CarouselPresentation />
      <div className="lg:flex-col lg:h-full lg:w-fit w-full flex">
      <div className="lg:h-1/2 lg:w-[1px] h-[1px] w-1/2 bg-gradient-to-r lg:bg-gradient-to-b  from-transparent from-10% to-black to-80%"></div>
      <div className="lg:h-1/2 lg:w-[1px] h-[1px] w-1/2 bg-gradient-to-l lg:bg-gradient-to-t  from-transparent from-10% to-black to-80%"></div>
      </div>
      <AuthForm />
      </div>
    </main>
  );
};

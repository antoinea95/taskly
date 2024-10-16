import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { useEffect, useRef, useState } from "react";
import { CarouselImageItem } from "./CarouselImageItem";
import { CarouselDot } from "./CarouselDot";
import { useTheme } from "@/utils/helpers/hooks/useThemeContext";

export const CarouselPresentation = () => {
  const [api, setApi] = useState<CarouselApi>()
  const {theme} = useTheme();
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (!api) {
      return
    }
 
    setCurrent(api.selectedScrollSnap())
 
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap())
    })
  }, [api])


  const plugin = useRef(
    Autoplay({
      delay: 10000,
      stopOnInteraction: true,
    })
  );

  console.log(current)

  return (
    <>
    <Carousel
      className="max-w-xl relative flex-1"
      opts={{
        align: "start",
        loop: true,
      }}
      plugins={[plugin.current]}
      setApi={setApi}
    >
      <CarouselContent>
        <CarouselItem>
          <div className="p-1 space-y-3">
            <h2 className="text-4xl font-bold">Organize with Ease</h2>
            <p className="text-sm pb-5">
              Easily create and organize your workflow by adding new lists and
              tasks. Drag and drop tasks between lists to keep everything in
              order, ensuring smooth project management and streamlined
              productivity. Perfect for staying on top of your goals.
            </p>
            <CarouselImageItem>
              <img
                src={`./assets/${theme ? "board-page-black" : "board-page"}.png`}
                className="h-full w-full object-cover"
              />
            </CarouselImageItem>
          </div>
        </CarouselItem>
        <CarouselItem>
          <div className="p-1 space-y-3">
            <h2 className="text-4xl font-bold">Collaborate & Communicate</h2>
            <p className="text-sm pb-5">
              Enhance teamwork by adding members to boards, assigning tasks, and
              enabling real-time comments. Keep everyone on the same page with
              task ownership, improving accountability and communication across
              the team.
            </p>
            <CarouselImageItem>
              <img
                src={`./assets/${theme ? "add-member-black" : "add-member"}.png`}
                className="h-full w-full object-cover"
              />
            </CarouselImageItem>
          </div>
        </CarouselItem>
        <CarouselItem>

        <div className="p-1 space-y-3">
            <h2 className="text-4xl font-bold">Stay on Track & Meet Deadlines</h2>
            <p className="text-sm pb-5">
            Keep your projects on track by setting deadlines for tasks and
            adding checklists to ensure every step is completed. Stay informed
            about your project’s progress and achieve your goals efficiently
            with progress tracking tools.
            </p>
            <CarouselImageItem>
              <img
                src={`./assets/${theme ? "task-black" : "task"}.png`}
                className="h-full w-full object-cover"
              />
            </CarouselImageItem>
          </div>
        </CarouselItem>
      </CarouselContent>
      <div className="flex items-center justify-center w-full h-16 relative">
        <CarouselPrevious variant="secondary" className="bg-gray-50 dark:bg-gray-900 dark:hover:bg-gray-700 dark:text-gray-300 shadow-none" />
        <CarouselDot current={current} />
        <CarouselNext variant="secondary" className="bg-gray-50 dark:bg-gray-900 dark:hover:bg-gray-700 dark:text-gray-300 shadow-none" />
      </div>
    </Carousel>
    </>
  );
};
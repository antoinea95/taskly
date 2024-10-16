import { Dot } from "lucide-react"

export const CarouselDot = ({current} : {current:number}) => {

    return (
        <div className="flex items-center gap-1">
        {Array.from({length: 3}).map((_, index) => (
          <span className={`${current === index ? "text-gray-900 dark:text-gray-300" : "text-gray-300 dark:text-gray-700"}`} key={index}>
            <Dot size={35} />
          </span>
        ))}
      </div>
    )
}
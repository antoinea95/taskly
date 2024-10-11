import { useEffect, useState } from "react";


export const useElapsedTime = ({createdAt} : {createdAt: number}): string => {

    const [date, setDate] = useState<number>(Date.now());;

    useEffect(() => {
        const timeOut = setInterval(() => {
            setDate(Date.now());
        }, 120000);
    
        return () => clearTimeout(timeOut);
    }, []);



    const timeAgo = (): string => {
        const now = date;
        const diffInSeconds = Math.floor((now - createdAt) / 1000);
        let unit: string;
        let value: number | string;
    
        if (diffInSeconds < 60) {
          return " • Now";
        }
    
        switch (true) {
          case diffInSeconds < 3600: // 60 * 60
            unit = "minute";
            value = Math.floor(diffInSeconds / 60);
            break;
          case diffInSeconds < 86400: // 60 * 60 * 24
            unit = "hour";
            value = Math.floor(diffInSeconds / 3600);
            break;
          case diffInSeconds < 2592000: // 60 * 60 * 24 * 30
            unit = "day";
            value = Math.floor(diffInSeconds / 86400);
            break;
          case diffInSeconds < 31536000: // 60 * 60 * 24 * 365
            unit = "month";
            value = Math.floor(diffInSeconds / 2592000);
            break;
          default:
            unit = "year";
            value = Math.floor(diffInSeconds / 31536000);
            break;
        }
    
        return ` • ${value} ${unit}${value > 1 ? "s" : ""} ago`;
      };


      return timeAgo();
}
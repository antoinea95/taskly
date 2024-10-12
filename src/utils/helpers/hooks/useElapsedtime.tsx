import { useEffect, useState } from "react";

/**
 * Custom hook that calculates and returns the time elapsed since a given timestamp.
 * The time is updated every two minutes to keep it current.
 * 
 * @param {object} params - The parameters object.
 * @param {number} params.createdAt - The timestamp (in milliseconds) from which the elapsed time is calculated.
 * 
 * @returns A string indicating the time that has passed since the provided timestamp (e.g., " • 5 minutes ago").
 */
export const useElapsedTime = ({ createdAt }: { createdAt: number }): string => {
  const [date, setDate] = useState<number>(Date.now());

  useEffect(() => {
    // Updates the current time every two minutes
    const timeOut = setInterval(() => {
      setDate(Date.now());
    }, 120000); // 120000 milliseconds = 2 minutes

    return () => clearTimeout(timeOut); // Cleanup interval on component unmount
  }, []);

  /**
   * Calculates how much time has passed since the creation time.
   * Returns a formatted string representing the time difference in minutes, hours, days, etc.
   * 
   * @returns {string} The formatted string of time elapsed.
   */
  const timeAgo = (): string => {
    const now = date;
    const diffInSeconds = Math.floor((now - createdAt) / 1000);
    let unit: string;
    let value: number | string;

    // Less than a minute ago
    if (diffInSeconds < 60) {
      return " • Now";
    }

    // Determine the correct time unit and value based on the time difference
    switch (true) {
      case diffInSeconds < 3600: // Less than an hour ago
        unit = "minute";
        value = Math.floor(diffInSeconds / 60);
        break;
      case diffInSeconds < 86400: // Less than a day ago
        unit = "hour";
        value = Math.floor(diffInSeconds / 3600);
        break;
      case diffInSeconds < 2592000: // Less than a month ago
        unit = "day";
        value = Math.floor(diffInSeconds / 86400);
        break;
      case diffInSeconds < 31536000: // Less than a year ago
        unit = "month";
        value = Math.floor(diffInSeconds / 2592000);
        break;
      default: // More than a year ago
        unit = "year";
        value = Math.floor(diffInSeconds / 31536000);
        break;
    }

    // Return the formatted time difference (e.g., " • 5 minutes ago")
    return ` • ${value} ${unit}${value > 1 ? "s" : ""} ago`;
  };

  return timeAgo();
};

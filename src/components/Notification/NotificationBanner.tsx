import { CheckCircle, ShieldX } from "lucide-react";
import { useEffect, useState } from "react";

/**
 * `NotificationBanner` displays a temporary status message with an icon based on the success or error state.
 * It will automatically hide after 3 seconds.
 *
 * @param {Object} props - The properties for the notification banner.
 * @param {boolean} [props.isSuccess] - Indicates if the message is a success message. Displays a green icon.
 * @param {boolean} [props.isError] - Indicates if the message is an error message. Displays a red icon.
 * @param {string} props.content - The content of the notification message to be displayed.
 * 
 * @returns The rendered notification banner component.
 */
export const NotificationBanner = ({
  isSuccess,
  isError,
  content
}: {
  isSuccess?: boolean;
  isError?: boolean;
  content: string;
}) => {
  const [isVisible, setIsVisible] = useState(false);

  // Show the notification when `isSuccess` or `isError` changes, and hide it after 3 seconds.
  useEffect(() => {
    if (isError || isSuccess) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 3000);
      return () => clearTimeout(timer); // Cleanup timer on component unmount or re-render.
    }
  }, [isSuccess, isError]);

  // Class name based on the status (success or error).
  const messageClass = isSuccess ? "bg-green-500" : "bg-red-500";

  return (
    <>
      {isVisible && content.length > 0 && (
        <p
          className={`text-gray-200 flex items-center justify-center gap-2 text-sm p-3 rounded-xl w-full animate-fade-in leading-4 ${messageClass}`}
        >
          {isError ? <ShieldX size={16} /> : isSuccess ? <CheckCircle size={16} /> : null}
          {content}
        </p>
      )}
    </>
  );
};

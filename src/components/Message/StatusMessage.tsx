import { CheckCircle, ShieldX } from "lucide-react";
import { useEffect, useState } from "react";

export const StatusMessage = ({
  isSucess,
  isError,
  content
}: {
  isSucess?: boolean;
  isError?: boolean;
  content: string;
}) => {
  const [isShow, setIsShow] = useState(false);

  useEffect(() => {
    if (isError || isSucess) {
      setIsShow(true);
      const timer = setTimeout(() => {
        setIsShow(false); 
      }, 3000);
      return () => clearTimeout(timer); 
    }
  }, [isSucess, isError]);

  const classNameMessage = isSucess ? "bg-green-300" : "bg-red-300";

  return (
    <>
      {isShow && content.length > 0 && (
        <p
          className={`text-white flex items-center justify-center gap-2 text-sm px-3 h-10 rounded-xl w-full animate-fade-in ${classNameMessage}`}
        >
          {isError ? <ShieldX size={16} /> : isSucess ? <CheckCircle size={16} /> : null}
          {content}
        </p>
      )}
    </>
  );
};

import { CheckCircle } from "lucide-react";
import { Dispatch, PropsWithChildren, SetStateAction, useEffect } from "react";

export const SuccessMessage = ({
  isShow,
  setIsShow,
  children
}: PropsWithChildren<{
  isShow: boolean;
  setIsShow: Dispatch<SetStateAction<boolean>>;
}>) => {


    useEffect(() => {
        if (isShow) {
          const timer = setTimeout(() => {
            setIsShow(false);
          }, 3000);
          return () => clearTimeout(timer);
        }
      }, [isShow, setIsShow]);



  return (
    <>
      {isShow &&  (
        <p className="text-white flex items-center justify-center gap-2 text-sm px-3 h-10 rounded-xl bg-green-300 w-full animate-fade-in">
          <CheckCircle size={16}/> {children}
        </p>
      )}
    </>
  );
};

import { PropsWithChildren } from "react";
import { Button } from "../ui/button";
import { Loader } from "../ui/loader";

export const SubmitButton = ({
  isLoading,
  children,
  disabled
}: PropsWithChildren<{ isLoading: boolean, disabled?: boolean}>) => {
  return (
    <Button
      type="submit"
      disabled={disabled}
      className="px-3 rounded-xl w-full h-10"
    >
      {isLoading ? (
        <Loader data={{ color: "white", size: "1rem" }} />
      ) : (
        <>{children}</>
      )}
    </Button>
  );
};

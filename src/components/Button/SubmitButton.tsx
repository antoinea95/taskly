import { PropsWithChildren } from "react";
import { Button } from "../ui/button";
import { Loader } from "../ui/loader";

export const SubmitButton = ({
  isLoading,
  children,
}: PropsWithChildren<{ isLoading: boolean }>) => {
  return (
    <Button
      type="submit"
      disabled={isLoading}
      className="px-3 rounded-xl w-fit h-10"
    >
      {isLoading ? (
        <Loader data={{ color: "white", size: "1rem" }} />
      ) : (
        <>{children}</>
      )}
    </Button>
  );
};

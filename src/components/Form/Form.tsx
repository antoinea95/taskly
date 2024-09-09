import { zodResolver } from "@hookform/resolvers/zod";
import { FieldValues, Path, useForm } from "react-hook-form";
import { ZodType } from "zod";
import { Input } from "../ui/input";
import { ErrorType, StatusType } from "@/utils/types";
import { Loader } from "../ui/loader";
import { Button } from "../ui/button";
import { Label } from "../ui/label";

type FormProps<T extends FieldValues> = {
  schema: ZodType<T>;
  onSubmit: (data: T) => void;
  formContent: {
    name: string;
    type: string;
    placeholder: string;
    label?: string;
    value?: string;
  }[];
  buttonName: string;
  status: StatusType;
  error: ErrorType;
};

export const Form = <T extends FieldValues>({
  schema,
  onSubmit,
  formContent,
  buttonName,
  status,
  error,
}: FormProps<T>) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<T>({
    mode: "onBlur",
    resolver: zodResolver(schema),
  });

  const isLoading = status === "loading";
  const isError = status === "error";

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4 py-10"
    >
      {formContent.map((item, index) => (
        <div key={index}>
          {item.label && <Label htmlFor={item.name}>{item.label}</Label>}
          <Input
            type={item.type}
            id={item.name}
            {...register(item.name as Path<T>)}
            placeholder={item.placeholder}
            defaultValue={item?.value}
          />
          {errors[item.name] && (
            <small className="text-xs font-semibold text-red-600">
              {(errors[item.name] as { message?: string }).message || "Error"}
            </small>
          )}
        </div>
      ))}
      <Button
        type="submit"
        disabled={isLoading || Object.keys(errors).length > 0}
      >
        {isLoading ? (
          <Loader data={{ color: "white", size: "4" }} />
        ) : (
          buttonName
        )}
      </Button>
      {isError && (
        <small className="text-xs font-semibold text-red-600">{error}</small>
      )}
    </form>
  );
};

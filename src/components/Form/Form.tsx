import { zodResolver } from "@hookform/resolvers/zod";
import { FieldValues, Path, useForm } from "react-hook-form";
import { ZodType } from "zod";
import { Input } from "../ui/input";
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
  isError: boolean;
  isLoading: boolean;
  error: Error | null;
};

export const Form = <T extends FieldValues>({
  schema,
  onSubmit,
  formContent,
  buttonName,
  isError,
  isLoading,
  error
}: FormProps<T>) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<T>({
    mode: "onBlur",
    resolver: zodResolver(schema),
  });

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4"
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
            autoComplete="true"
          />
          {errors[item.name] && (
            <small className="text-xs font-semibold text-red-600">
              {(errors[item.name] as { message?: string }).message || "Error"}
            </small>
          )}
        </div>
      ))}
      <Button type="submit">
        {isLoading ? (
          <Loader data={{ color: "white", size:"1rem"}} />
        ) : (
          buttonName
        )}
      </Button>
      {isError && (
        <small className="text-xs font-semibold text-red-600 my-3 text-center">{error?.message}</small>
      )}
    </form>
  );
};

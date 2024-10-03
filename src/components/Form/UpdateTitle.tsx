import { zodResolver } from "@hookform/resolvers/zod";
import { useState, ElementType, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem } from "../ui/form";
import { Input } from "../ui/input";
import { UseMutationResult } from "@tanstack/react-query";

interface UpdateTitleProps<T extends { title: string }> {
  name: string;
  title: string;
  query: UseMutationResult<any, unknown, Partial<T>>;
  headingLevel?: ElementType;
}

export const UpdateTitle = <T extends { title: string }>({
  name,
  title,
  query,
  headingLevel: Heading = "h1", // Défaut sur h1 si non fourni
}: UpdateTitleProps<T>) => {
  const [isUpdate, setIsUpdate] = useState(false);
  const divRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (divRef.current && !divRef.current.contains(event.target as Node)) {
        setIsUpdate(false);
      }
    };

    if (isUpdate) {
      if (inputRef.current) {
        inputRef.current.focus();
      }
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isUpdate]);

  const titleSchema = z.object({
    title: z.string().min(2),
  });

  const form = useForm<z.infer<typeof titleSchema>>({
    mode: "onSubmit",
    resolver: zodResolver(titleSchema),
  });

  const onSubmit = async (data: z.infer<typeof titleSchema>) => {
    query.mutate(
      {
        title: data.title,
      } as Partial<T>,
      {
        onSuccess: () => setIsUpdate(false),
      }
    );
  };

  // Définir la taille en fonction du headingLevel
  const headingSizeClass =
    Heading === "h1" ? "text-4xl uppercase" : Heading === "h2" ? "text-4xl w-fit" : Heading === "h3" ? "text-xl" : "text-lg";
  const inputSizeClass =
    Heading === "h1"
      ? "h-14 text-4xl"
      : Heading === "h2"
        ? "h-14 text-4xl"
        : Heading === "h3" ? "h-11 text-xl" : "h-11 text-lg";

  return (
    <div onClick={() => setIsUpdate(true)} ref={divRef}>
      {!isUpdate ? (
        <Heading
          className={`px-3 py-2 cursor-text rounded-xl hover:bg-gray-200 animate-fade-in ${headingSizeClass}`}
        >
          {title}
        </Heading>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="animate-fade-in">
            <FormField
              control={form.control}
              name={"title"}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder={`${name} title`}
                      defaultValue={title}
                      onChange={field.onChange}
                      type={"text"}
                      className={`rounded-xl border-none shadow-none bg-gray-200 ${inputSizeClass}`}
                      style={{ width: `${Math.max(title.length, 11)}ch` }}
                      ref={inputRef}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </form>
        </Form>
      )}
    </div>
  );
};

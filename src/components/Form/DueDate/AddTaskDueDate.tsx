import { Calendar, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Checkbox } from "../../ui/checkbox";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "../../ui/form";
import { SubmitButton } from "../../Button/SubmitButton";
import { CloseButton } from "../../Button/CloseButton";
import { ToggleButton } from "../../Button/ToggleButton";
import { useUpdateDoc } from "@/firebase/mutateHook";
import { TaskType } from "@/utils/types";
import { SelectedDate } from "./SelectedDate";

export const AddTaskDueDate = ({ task }: { task: TaskType }) => {
  const [isAddDate, setIsAddDate] = useState(false);
  const [isBeginDate, setIsBeginDate] = useState(false);
  const updateTask = useUpdateDoc<TaskType>("tasks", "tasks", task.id);

  const today = new Date();
  today.setHours(0, 0, 0, 0);


  useEffect(() => {
    if (task.dueDate && task.dueDate.from) {
      setIsBeginDate(true);
    }
  }, [task.dueDate]);

  const schema = z
    .object({
      to: z.date().refine((date) => date.getTime() >= today.getTime(), {
        message: "The due date cannot be in the past.",
      }),
      from: z
        .date()
        .nullable()
        .refine((date) => !date || date.getTime() >= today.getTime(), {
          message: "The begin date cannot be in the past.",
        }),
    })
    .refine((data) => !data.from || data.from < data.to, {
      message: "The begin date must be before the due date.",
      path: ["from"], // Cette erreur sera associée au champ 'from'
    });

  const form = useForm<z.infer<typeof schema>>({
    mode: "onSubmit",
    resolver: zodResolver(schema),
    defaultValues: {
      to: task.dueDate ? new Date(task.dueDate.to) : undefined,
      from:
        task.dueDate && task.dueDate.from ? new Date(task.dueDate.from) : null,
    },
  });

  const onSubmit = (values: z.infer<typeof schema>) => {
    console.log(values);
    updateTask.mutate(
      {
        dueDate: {
          completed: false,
          to: values.to.toDateString(),
          from: values.from && isBeginDate ? values.from.toDateString() : null,
        },
      },
      {
        onSuccess: () => setIsAddDate(false),
      }
    );
  };


  return (
    <>
      {isAddDate ? (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-3 bg-gray-100 p-5 rounded-xl"
          >
            <SelectedDate form={form} name="to" />
            {isBeginDate && <SelectedDate form={form} name="from" />}
            <div className="flex items-center ml-1 w-full">
              <Checkbox
                id="begin"
                defaultChecked={task.dueDate?.from ? true : false}
                onCheckedChange={() => {
                  setIsBeginDate((prev) => !prev);
                }}
                className="border-2 shadow-none flex items-center justify-center"
              />
              <label
                htmlFor="begin"
                className="text-sm font-medium flex-1 pl-1 cursor-pointer"
              >
                Add a begin date?
              </label>
            </div>
            <div className="flex items-center gap-2">
              <SubmitButton isLoading={false}>Add due date</SubmitButton>
              <CloseButton setIsOpen={setIsAddDate}>
                <X size={16} />
              </CloseButton>
            </div>
          </form>
        </Form>
      ) : (
        <ToggleButton setIsOpen={setIsAddDate}>
          <Calendar size={16} />
          Add a due date
        </ToggleButton>
      )}
    </>
  );
};

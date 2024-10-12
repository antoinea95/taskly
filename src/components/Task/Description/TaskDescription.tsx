import { MessageSquare, PenLine } from "lucide-react";
import { useEffect, useState } from "react";
import { z } from "zod";
import { TaskType } from "@/utils/types/tasks.types";
import { MutationResultType } from "@/utils/types/form.types";
import { FormContainer } from "@/components/Form/containers/FormContainer";
import { FormFieldInputItem } from "@/components/Form/fields/FormFieldInputItem";
import { FormActionsButton } from "@/components/Form/actions/FormActionsButton";

/**
 * Component for displaying and updating the task description.
 * 
 * @param {Object} props - The component props.
 * @param {string} [props.description] - The initial task description. If undefined, the component will automatically enter "edit" mode.
 * @param {MutationResultType<string, Partial<TaskType>>} props.mutationQuery - The mutation query used to update the task description.
 * @returns The rendered task description component.
 */
export const TaskDescription = ({
  description,
  mutationQuery,
}: {
  mutationQuery: MutationResultType<string, Partial<TaskType>>;
  description?: string;
}) => {
  const [isUpdate, setIsUpdate] = useState(false);

  // Validation schema for the description form
  const descriptionSchema = z.object({
    description: z.string().min(1),
  });

  // Automatically enters "edit" mode if description is not provided
  useEffect(() => {
    if (!description) {
      setIsUpdate(true);
    }
  }, [description]);

  /**
   * Handles the form submission to update the task description.
   *
   * @param {Partial<TaskType>} data - The form data containing the new description.
   */
  const handleAddDescription = (data: Partial<TaskType>) => {
    mutationQuery.mutate(
      {
        description: data.description,
      },
      {
        onSuccess: () => {
          setIsUpdate(false); // Exit edit mode upon successful update
        },
      }
    );
  };

  return (
    <div className="flex flex-col gap-3 my-2">
      <h3 className="flex items-center gap-2 font-medium">
        <PenLine size={20} />
        Description
      </h3>
      {!isUpdate ? (
        <p
          onClick={() => setIsUpdate(true)}
          className="cursor-pointer font-medium bg-gray-50 px-2 py-3 rounded-xl hover:bg-gray-100"
        >
          {description}
        </p>
      ) : (
        <FormContainer
          onSubmit={handleAddDescription}
          schema={descriptionSchema}
          mutationQuery={mutationQuery}
          defaultValues={{
            description: description ? description : undefined
          }}
        >
          {({ form }) => (
            <>
              <FormFieldInputItem
                form={form}
                item={{
                  name: "description",
                  type: "text",
                  placeholder: "your description",
                }}
              />
              <FormActionsButton
                isPending={mutationQuery.isPending}
                setIsOpen={setIsUpdate}
              >
                <span className="flex item-center gap-2">
                  <MessageSquare size={16} /> {`${description ? "Update" : "Add"} description`}
                </span>
              </FormActionsButton>
            </>
          )}
        </FormContainer>
      )}
    </div>
  );
};

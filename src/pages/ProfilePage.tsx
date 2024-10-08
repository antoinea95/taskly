import { CreateForm } from "@/components/Form/CreateForm";
import { UpdatePassword } from "@/components/Form/Profile/UpdatePassword";
import { UpdatePicture } from "@/components/Form/Profile/UpdatePicture";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/firebase/authHook";
import { useUpdateDoc } from "@/firebase/mutateHook";
import { FormContent, UserType } from "@/utils/types";
import { getAuth, updateEmail } from "firebase/auth";
import { useEffect, useState } from "react";
import { z } from "zod";

export const ProfilePage = () => {
  const { currentUser } = useAuth();
  const user = getAuth().currentUser;
  const [formContent, setFormContent] = useState<FormContent>([]);
  const updateUser = useUpdateDoc<UserType>("user", "users", currentUser?.id, currentUser?.id);

  const userSchema = z.object({
    name: z.string().min(2).optional(),
    email: z.string().email().optional(),
});

  const onSubmit = async (values: z.infer<typeof userSchema>) => {
    try {

      if (values.email && user) {
        if (values.email !== user.email) {
          await updateEmail(user, values.email);
        }
      }

    
  
      const updateData: Partial<UserType> = {};
      if (values.name) updateData.name = values.name;
      if (values.email) updateData.email = values.email;
  
      updateUser.mutate({
        ...updateData
      });
    } catch (error) {
      console.error("Erreur during profile update :", error);
    }
  };

  useEffect(() => {
    if(currentUser) {
      console.log(currentUser)
      setFormContent([
        {
          name: "name",
          type: "text",
          placeholder: "John Doe",
          label: "Name",
          value: currentUser.name
        },
        {
          name: "email",
          type: "email",
          placeholder: "john@doe.com",
          label: "E-mail",
          value: currentUser.email
        },
      ])
    }
  }, [currentUser])

  return (
    <>
      {currentUser ? (
        <main className="flex-1 flex flex-col font-outfit">
          <h1 className="text-4xl uppercase px-3 py-2">Profile</h1>
          <section className="w-5/6 h-fit grid grid-cols-7 mx-auto place-items-center place-content-start gap-8 p-3 mt-4">
            <UpdatePicture user={currentUser} />
            <div className="col-span-4 w-full bg-white rounded-xl p-10 flex items-center">
            <CreateForm
              schema={userSchema}
              onSubmit={onSubmit}
              query={updateUser}
              formContent={formContent}
              buttonName="Update Profile"
            />
            </div>
            <div className="col-span-3 h-full w-full space-y-3 bg-white rounded-xl p-3">
            <UpdatePassword user={user} />
            <Button className="w-full px-3 rounded-xl">Delete your account</Button>
            </div>
          </section>
        </main>
      ) : (
        <Skeleton />
      )}
    </>
  );
};

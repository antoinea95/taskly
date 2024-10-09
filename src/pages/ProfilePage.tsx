import { reauthenticateUser } from "@/components/Auth/ReauthUser";
import { CreateForm } from "@/components/Form/CreateForm";
import { DeleteItem } from "@/components/Form/DeleteItem";
import { UpdatePassword } from "@/components/Form/Profile/UpdatePassword";
import { UpdatePicture } from "@/components/Form/Profile/UpdatePicture";
import { StatusMessage } from "@/components/Message/StatusMessage";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/firebase/authHook";
import { useGetBoards } from "@/firebase/fetchHook";
import FirestoreApi from "@/firebase/FirestoreApi";
import { useDeleteDoc, useUpdateDoc } from "@/firebase/mutateHook";
import { BoardType, FormContent, UserType } from "@/utils/types";
import { useMutation } from "@tanstack/react-query";
import { getAuth, updateEmail, User } from "firebase/auth";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

export const ProfilePage = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const user = getAuth().currentUser;
  const [formContent, setFormContent] = useState<FormContent>([]);
  const [isNeedPassword, setIsNeedPassword] = useState(false);
  const updateUser = useUpdateDoc<UserType>(
    "user",
    "users",
    currentUser?.id,
    currentUser?.id
  );

  const deleteUser = useDeleteDoc("user", "users", currentUser?.id);
  const isGoogle = user?.providerData.some((item) => item.providerId === "google.com");

  const boards = useGetBoards(currentUser?.id);

  const userSchema = z.object({
    name: z.string().min(2).optional(),
    email: z.string().email().optional(),
    password: z.string().min(8).optional(),
  });

  const { mutateAsync, error, isError, isSuccess } = useMutation({
    mutationFn: async (variables: {
      values: z.infer<typeof userSchema>;
      user: User | null;
    }) => {
      const { values, user } = variables;
      if (isNeedPassword && values.password) {
        await reauthenticateUser(values.password);
      } else if (values.email && user) {
        await updateEmail(user, values.email);
      }
    },
  });

  const onSubmit = async (values: z.infer<typeof userSchema>) => {
    try {
      await mutateAsync({
        values,
        user,
      });

      const updateData: Partial<UserType> = {};
      if (values.name) updateData.name = values.name;
      if (values.email) updateData.email = values.email;

      updateUser.mutate(
        {
          ...updateData,
        },
        {
          onSuccess: () => {
            setIsNeedPassword(false);
          },
        }
      );
    } catch (error: any) {
      console.error("Erreur during profile update :", error.code);
      setIsNeedPassword(true);
    }
  };


  useEffect(() => {
    if (currentUser) {
      let updatedFormContent: FormContent = [
        {
          name: "name",
          type: "text",
          placeholder: "John Doe",
          label: "Name",
          value: currentUser.name,
        },
        {
          name: "email",
          type: "email",
          placeholder: "john@doe.com",
          label: "E-mail",
          value: currentUser.email,
        },
      ];
  
      if (isGoogle) {
        updatedFormContent = updatedFormContent.filter((item) => item.name !== "email");
      }
  
      if (isNeedPassword) {
        updatedFormContent.push({
          name: "password",
          type: "password",
          placeholder: "********",
          label: "Please provide your password",
        });
      }
  
      setFormContent(updatedFormContent);
    }
  }, [currentUser, isGoogle, isNeedPassword, isSuccess]);
  

  const handleDeleteAccount = async () => {
    if (!user) return;

    try {
      if (boards.isFetched && boards.data) {
        await Promise.all(
          boards.data.map(async (board) => {
            if (board.creator === user.uid) {
              await FirestoreApi.deleteBoard(board.id);
            } else {
              await FirestoreApi.updateDocument<BoardType>(
                "boards",
                {
                  members: board.members.filter(
                    (member) => member !== user.uid
                  ),
                },
                board.id
              );
            }
          })
        );
      }
      await deleteUser.mutateAsync();
      await user.delete();
      navigate("/login");
    } catch (error) {
      console.error("Error deleting account:", error);
    }
  };
  return (
    <>
      {currentUser ? (
        <main className="flex-1 flex flex-col font-outfit">
          <h1 className="text-4xl uppercase px-3 py-2">{currentUser.name}</h1>
          <section className="flex flex-col items-center space-y-3 w-full">
            <UpdatePicture user={currentUser} />
            <div className="p-3 rounded-xl bg-white w-1/2 space-y-3">
              <CreateForm<UserType>
                schema={userSchema}
                onSubmit={onSubmit}
                query={updateUser}
                formContent={formContent}
                buttonName="Update Profile"
              />
              <StatusMessage
                isError={isError}
                isSucess={isSuccess}
                content={
                  isSuccess
                    ? "Profile updated"
                    : error instanceof Error &&
                        !error.message.includes("auth/requires-recent-login")
                      ? error.message
                      : ""
                }
              />
            </div>
            <div className="space-y-3 w-1/2 pt-2">
              {!isGoogle && <UpdatePassword user={user} />}
              <DeleteItem
                name="account"
                isText
                handleDelete={handleDeleteAccount}
                isPending={deleteUser.isPending}
                isGoogle={isGoogle}
              />
            </div>
          </section>
        </main>
      ) : (
        <Skeleton />
      )}
    </>
  );
};

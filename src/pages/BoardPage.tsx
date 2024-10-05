import { useGetDoc } from "@/firebase/fetchHook";
import { BoardType } from "@/utils/types";
import { useNavigate, useParams } from "react-router-dom";
import { ListsSection } from "../components/List/ListsSection";
import { BoardPageSkeleton } from "@/components/skeletons";
import { useDeleteDoc, useUpdateDoc } from "@/firebase/mutateHook";
import { DeleteItem } from "@/components/Form/DeleteItem";
import { UpdateTitle } from "@/components/Form/UpdateTitle";
import { AddMember } from "@/components/Members/AddMember";
import { useAuth } from "@/firebase/authHook";
import { MembersDetails } from "@/components/Members/MembersDetails";

export const BoardPage = () => {
  const { boardId } = useParams<{ boardId?: string }>();
  const {currentUser} = useAuth()
  const naviagate = useNavigate();

  
  const { data: board, isFetched } = useGetDoc<BoardType>("boards", boardId);
  const deleteBoard = useDeleteDoc("boards", "boards", boardId)
  const updateBoard = useUpdateDoc<BoardType>("board", "boards", boardId ?? "");

  if (!boardId || !isFetched) {
    return <BoardPageSkeleton />;
  }

  const handleDelete = async () => {
    deleteBoard.mutate([], {
      onSuccess: () => naviagate("/"),
    });
  };

  return (
    <main className="flex-1 flex flex-col">
      {board && isFetched && (
        <>
          <header className="flex justify-between items-center">
            <UpdateTitle
              title={board.title}
              name="Board"
              query={updateBoard}
              headingLevel={"h1"}
            />
            <div className="flex items-start gap-3 h-10">
              <MembersDetails members={board.members} creator={board.creator} query={updateBoard} isBoard />
              {board.creator === currentUser?.id && <AddMember queryName="boards" queryId={board.creator} query={updateBoard} members={board.members}/>}
              <DeleteItem
                name="board"
                handleDelete={handleDelete}
                isText={false}
                isPending={deleteBoard.isPending}
              />
            </div>
          </header>
          <ListsSection boardId={boardId} />
        </>
      )}
    </main>
  );
};

import { BoardType } from "../../utils/types";
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Member} from "../Members/Member";
import { MembersAvatarList } from "../Members/MembersAvatarList";


export const BoardCard = ({ board }: { board: BoardType }) => {
  const navigate = useNavigate();
  const createdDate = () => {
   const date = new Date(board.createdAt);
   const timeArray = date.toLocaleTimeString().split(":");
   const time = `${timeArray[0]}:${timeArray[1]}`
   return `${date.toLocaleDateString()} at ${time}`
  }

  return (
    <Card
      className="w-64 h-32 flex flex-col justify-between shadow-none bg-white border-2 border-transparent overflow-hidden rounded-xl pt-3 pb-2 px-3 cursor-pointer hover:border-gray-200"
      onClick={() => navigate(`/${board?.id}`)}
    >
      <CardHeader className="flex-1 p-0">
      <small className="text-xs leading-3 "> Created on {createdDate()}</small>
        <CardTitle className="uppercase text-3xl tracking-normal font-light leading-none">{board?.title}</CardTitle>
      </CardHeader>
      <CardFooter className="flex justify-end p-0">
        <MembersAvatarList members={board.members}>
          {board.members.slice(0, 5).map((member) => (
            <Member
              key={member} 
              userId={member}
              type="avatar"
            />
          ))}
        </MembersAvatarList>
      </CardFooter>
    </Card>
  );
};

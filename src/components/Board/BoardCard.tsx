import { BoardType } from "../../utils/types";
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Members} from "./Members";


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
        <div className="flex justify-end -space-x-3">
          {board.members.slice(0, 5).map((member) => (
            <Members
              key={member} 
              userId={member}
              type="avatar"
            />
          ))}
          {board.members.length > 5 && (
            <div className="w-8 h-8 rounded-full bg-black text-gray-700 flex items-center justify-center text-sm font-semibold">
              +{board.members.length - 5}
            </div>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

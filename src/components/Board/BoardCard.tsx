import { BoardType } from "../../utils/types/boards.types";
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Member } from "../Members/Member";
import { MembersAvatarList } from "../Members/MembersAvatarList";
import { createdDate } from "@/utils/helpers/functions/createdDate";
import { Label } from "../Label/Label";

/**
 * BoardCard component displays a card that represents a board.
 * It includes the board's title, creation date, and a list of board members' avatars.
 * Clicking on the card navigates to the specific board's page.
 *
 * @param props - The properties for the BoardCard component.
 * @param {BoardType} props.board - The board object containing data such as title, creation date, and members.
 *
 * @returns A card with board information and member avatars.
 */

export const BoardCard = ({ board }: { board: BoardType }) => {

  const navigate = useNavigate();

  return (
    <Card
      className="w-64 h-32 flex flex-col justify-between shadow-none bg-white border-2 border-transparent overflow-hidden rounded-xl pt-3 pb-2 px-3 cursor-pointer hover:border-gray-200"
      onClick={() => navigate(`/${board?.id}`)}
    >
      <CardHeader className="flex-1 p-0">
        <CardTitle className="text-xl tracking-normal font-medium leading-none">
          {board?.title}
        </CardTitle>
      </CardHeader>
      <CardFooter className="flex justify-between p-0">
        <Label color="#d1d5db">
        {createdDate(board.createdAt)}
        </Label>
        <MembersAvatarList members={board.members}>
          {board.members.slice(0, 5).map((member) => (
            <Member key={member} userId={member} type="avatar" />
          ))}
        </MembersAvatarList>
      </CardFooter>
    </Card>
  );
};

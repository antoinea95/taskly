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
      className="max-w-72 min-w-60 shadow-none flex flex-col justify-between border-none bg-gray-100 rounded-xl cursor-pointer hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 animate-top-to-bottom"
      onClick={() => navigate(`/${board?.id}`)}
    >
      <CardHeader className="flex-1">
        <CardTitle>
          {board?.title}
        </CardTitle>
        <Label color="#d1d5db">
        {createdDate(board.createdAt)}
        </Label>
      </CardHeader>
      <CardFooter className="flex justify-end">
        <MembersAvatarList members={board.members}>
          {board.members.slice(0, 5).map((member) => (
            <Member key={member} userId={member} type="avatar" />
          ))}
        </MembersAvatarList>
      </CardFooter>
    </Card>
  );
};

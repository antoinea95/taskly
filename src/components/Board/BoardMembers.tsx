import { BoardType } from "@/utils/types";
import { Members } from "./Members";
import { HoverCard, HoverCardContent } from "../ui/hover-card";
import { HoverCardTrigger } from "@radix-ui/react-hover-card";

export const BoardMembers = ({ board }: { board: BoardType }) => {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <div className="flex justify-end -space-x-3">
          {board.members.slice(0, 5).map((member) => (
            <Members key={member} userId={member} type="avatar" />
          ))}
          {board.members.length > 5 && (
            <div className="w-8 h-8 rounded-full bg-black text-gray-700 flex items-center justify-center text-sm font-semibold">
              +{board.members.length - 5}
            </div>
          )}
        </div>
      </HoverCardTrigger>
      <HoverCardContent className="mr-8">
        <div className="space-y-3">
          {board.members.map((member) => (
            <Members
              key={member}
              userId={member}
              type="list"
              isCreator={member === board.creator}
            />
          ))}
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};

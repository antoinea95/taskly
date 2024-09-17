import { Trash } from "lucide-react";
import { BoardType } from "../../utils/types";
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useDeleteDoc } from "@/firebase/mutateHook";
import { Loader } from "../ui/loader";
import { useNavigate } from "react-router-dom";

export const BoardCard = ({ board }: { board: BoardType }) => {

  const deleteBoard = useDeleteDoc("boards", "boards", board.id, ["lists", "tasks"]);
  const navigate = useNavigate();




  return (
    <Card className="w-72 h-32 flex flex-col justify-between overflow-hidden" onClick={() => navigate(`/${board.id}`)}>
          <CardHeader className="flex justify-center items-center pt-4">
            <CardTitle className="uppercase">{board.title}</CardTitle>
          </CardHeader>
          <CardFooter className="flex justify-center pb-3 gap-2">
            <Button onClick={() => deleteBoard.mutate()}>
              <Trash size={18} color="white" strokeWidth={2} className="mr-1" />
              {deleteBoard.isPending ? (
                <Loader data={{ color: "white", size: "1rem" }} />
              ) : (
                "Delete"
              )}
            </Button>
          </CardFooter>
    </Card>
)}

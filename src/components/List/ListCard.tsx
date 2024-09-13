import { ListType } from "@/utils/types"
import { Card, CardHeader, CardTitle } from "../ui/card"
import { useDeleteDoc } from "@/firebase/mutateHook"
import { Button } from "../ui/button";
import { X } from "lucide-react";

export const ListCard = ({list} : {list: ListType}) => {

    const deleteList = useDeleteDoc(`boards/${list.boardId}/lists`, list.id);

    return (
        <Card className="flex-1 min-h-96">
            <CardHeader className="flex  flex-row items-center justify-between">
                <CardTitle>{list.title}</CardTitle>
                <Button onClick={() => deleteList.mutate()} className="w-5 h-5 p-0 bg-transparent border-none shadow-none"> <X size={20} className="text-black" /></Button>
            </CardHeader>
        </Card>
    )
}
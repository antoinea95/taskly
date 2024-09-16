import { TaskType } from "@/utils/types"
import { Card, CardHeader } from "../ui/card"

export const TaskCard = ({task} : {task: TaskType}) => {

    return (
        <Card>
            <CardHeader>
                {task.title}
            </CardHeader>
        </Card>
    )
}
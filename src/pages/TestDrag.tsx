import { TaskType } from "@/utils/types"
import { DndContext, DragOverEvent, DragOverlay, DragStartEvent, useDroppable } from "@dnd-kit/core"
import { SortableContext, useSortable } from "@dnd-kit/sortable"
import { CSSProperties, useState } from "react"
import {CSS} from "@dnd-kit/utilities";

const containers = [
    {id: "0", title: "To do", order: 0},
    {id: "1", title: "In progress", order: 1},
    {id: "2", title: "Finish", order: 2},
]

const tasks = [
    {id: "3", title: "Test 1", listId: "0", order: 0},
    {id: "4", title: "Test 1", listId: "0", order: 1},
    {id: "5", title: "Test 1", listId: "1", order: 2},
]


const Task = ({id}: {id: string}) => {

    return <div className="border my-2">{id}</div>
}

const SortableTask = ({id}: {id: string}) => {
    const {attributes, listeners, setNodeRef, transform, transition} = useSortable({id})

    const style: CSSProperties = {
        transform: CSS.Transform.toString(transform),
        transition
    }

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            <Task id={id} />
        </div>
    )
}



const Container = ({id} : {id: string}) => {
    
    const {setNodeRef} = useDroppable({id})

    return (<SortableContext id="id" items={tasks.map((task) => task.id)}>
        <div ref={setNodeRef} className="border w-32 h-96">
            {tasks.filter((task) => task.listId === id).map((task) => (
                <SortableTask key={task.id} id={task.id} />
            ))}
        </div>
    </SortableContext>)
}


const findContainer = (id: string)  => {
    if(id in tasks) {
        return id;
    }
    return Object.keys(tasks).find((key) => tasks[key].includes(id));

}






export const TestDrag = () => {
    const [activeId, setActiveId] = useState<string | null>(null);

    const handleDragStart = (event: DragStartEvent) => {
        const {id} = event.active;
        setActiveId(id.toString());
    }

    const handleDropOver = (event: DragOverEvent) => {
        const {active, over} = event;
        if(!over) return;
        
        const {id} = active;
        const overId = over?.id;
    
        const activeContainer = findContainer(id.toString());
        const overContainer = findContainer(overId.toString());
    
        if(!activeContainer || !overContainer || activeContainer === overContainer) return;
    }


    return (
        <DndContext onDragStart={handleDragStart}>
            <div className="flex w-full gap-10">
            {containers.map((container) => (
                <Container key={container.id} id={container.id} />
            ))}
            </div>
            <DragOverlay>{activeId && <Task id={activeId} /> }</DragOverlay>
          
        </DndContext>
    )
}
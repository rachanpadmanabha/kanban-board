import { useDroppable } from "@dnd-kit/core";
import Card from "./Card";
import {

    SortableContext,
    rectSortingStrategy,

} from "@dnd-kit/sortable";

function CardColumns({ column }) {
    const { setNodeRef } = useDroppable({ id: column.id });
    return (
        <SortableContext
            items={column.data.map((item) => item.id)} id={column.id}
            strategy={rectSortingStrategy}
        >
            <div ref={setNodeRef} key={column.id} className="flex flex-col gap-2 p-2 border border-gray-300 rounded-lg">
                <h2 className="text-gray-900 font-medium text-lg">{column.name}</h2>

                {column.data.map((item) => (
                    <Card key={item.id} data={item} />
                ))}

            </div>
        </SortableContext>
    );
}

export default CardColumns;

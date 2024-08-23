
import CardColumns from "./CardColumns";
import { columnData } from "./data";
import { useState } from "react";
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import {
    arrayMove,
    sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
function KanbanBoard() {
    const [columns, setColumns] = useState(columnData);
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const findColumn = (unique) => {
        if (!unique) {
            return null;
        }

        if (columns.some((c) => c.id === unique)) {
            return columns.find((c) => c.id === unique) ?? null;
        }
        const id = (unique);
        const itemWithColumnId = columns.flatMap((c) => {
            const columnId = c.id;
            return c.data.map((i) => ({ itemId: i.id, columnId: columnId }));
        });

        const columnId = itemWithColumnId.find((i) => i.itemId === id)?.columnId;
        return columns.find((c) => c.id === columnId) ?? null;
    };

    const handleDragOver = (event) => {
        const { active, over, delta } = event;

        const activeId = (active.id);
        const overId = over ? (over.id) : null;
        const activeColumn = findColumn(activeId);
        const overColumn = findColumn(overId);
        if (!activeColumn || !overColumn || activeColumn === overColumn) {
            return null;
        }
        setColumns((prevState) => {
            const activeItems = activeColumn.data;
            const overItems = overColumn.data;
            const activeIndex = activeItems.findIndex((i) => i.id === activeId);
            const overIndex = overItems.findIndex((i) => i.id === overId);
            const newIndex = () => {
                const putOnBelowLastItem =
                    overIndex === overItems.length - 1 && delta.y > 0;
                const modifier = putOnBelowLastItem ? 1 : 0;
                return overIndex >= 0 ? overIndex + modifier : overItems.length + 1;
            };
            return prevState.map((c) => {
                if (c.id === activeColumn.id) {
                    c.data = activeItems.filter((i) => i.id !== activeId);
                    return c;
                } else if (c.id === overColumn.id) {
                    c.data = [
                        ...overItems.slice(0, newIndex()),
                        activeItems[activeIndex],
                        ...overItems.slice(newIndex(), overItems.length)
                    ];
                    return c;
                } else {
                    return c;
                }
            });
        });
    };


    const handleDragEnd = (event) => {
        const { active, over } = event;
        const activeId = (active.id);
        const overId = over ? (over.id) : null;
        const activeColumn = findColumn(activeId);
        const overColumn = findColumn(overId);
        if (!activeColumn || !overColumn || activeColumn !== overColumn) {
            return null;
        }
        const activeIndex = activeColumn.data.findIndex((i) => i.id === activeId);
        const overIndex = overColumn.data.findIndex((i) => i.id === overId);
        if (activeIndex !== overIndex) {
            setColumns((prevState) => {
                return prevState.map((column) => {
                    if (column.id === activeColumn.id) {
                        column.data = arrayMove(overColumn.data, activeIndex, overIndex);
                        return column;
                    } else {
                        return column;
                    }
                });
            });
        }
    };

    return (

        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
            onDragOver={handleDragOver}
        >
            <div className="flex flex-row m-5 gap-10">
                <div className="flex flex-row gap-10">
                    {columns.map((column) => (
                        <CardColumns key={column.id} column={column} />
                    ))}
                </div>
            </div>
        </DndContext>


    );
}

export default KanbanBoard;

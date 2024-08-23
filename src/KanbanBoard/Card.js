import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import React from 'react'
const Card = React.memo(({ data }) => {
    let { tags, team_name, title, id } = data;

    const { attributes, listeners, setNodeRef, transform, transition } =
        useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (

        <div ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners} className="flex flex-col bg-white border border-gray-200 p-4 rounded-lg shadow-md w-72">
            <div className="flex items-center mb-2">
                <span className="bg-green-100 text-green-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-green-200 dark:text-green-900">{team_name}</span>
            </div>
            <h3 className="text-gray-900 font-medium text-lg">{title}</h3>
            <div className="text-gray-500 mt-2 mb-4">{"TICKET #" + id}</div>
            <div className="flex mb-2">
                {tags.map((tag, index) => (
                    <span key={index} className="bg-gray-200 text-gray-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded">
                        {tag}
                    </span>
                ))}
            </div>

        </div>

    );
})
export default Card;

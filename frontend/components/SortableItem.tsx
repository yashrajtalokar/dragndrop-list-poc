'use client';

import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';

interface Props {
    id: string;
    name: string;
    order: number;
    isPlaceholder?: boolean;
}

export function SortableItem({ id, name, order, isPlaceholder }: Props) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isPlaceholder ? 0 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="item-row"
        >
            <div className="drag-handle" {...attributes} {...listeners}>
                <GripVertical size={20} />
            </div>
            <div className="item-name">{name}</div>
            <div className="item-order"># {order}</div>
        </div>
    );
}

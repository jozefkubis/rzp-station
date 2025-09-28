"use client";

import {
  closestCenter,
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useState } from "react";

function Row({ id, name }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });
  const style = { transform: CSS.Transform.toString(transform), transition };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-3 border-t px-2 py-2"
    >
      <span
        {...attributes}
        {...listeners}
        className="cursor-grab select-none text-gray-400"
        title="Presuň riadok"
      >
        ⋮⋮
      </span>
      <span className="font-medium">{name}</span>
    </div>
  );
}

export default function DemoDnDRows() {
  const [items, setItems] = useState([
    { id: "u1", name: "Marek Zachar" },
    { id: "u2", name: "Jozef Kubis" },
    { id: "u3", name: "Lucia Hríbiková" },
  ]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );

  function onDragEnd({ active, over }) {
    if (!over || active.id === over.id) return;
    const oldIndex = items.findIndex((i) => i.id === active.id);
    const newIndex = items.findIndex((i) => i.id === over.id);
    setItems(arrayMove(items, oldIndex, newIndex));
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={onDragEnd}
    >
      <SortableContext
        items={items.map((i) => i.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="rounded-lg border">
          {items.map((i) => (
            <Row key={i.id} id={i.id} name={i.name} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}

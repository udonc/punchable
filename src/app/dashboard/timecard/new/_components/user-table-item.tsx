"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

type UserTableItemProps = {
	id: string;
	name: string;
	slug: string;
};

export const UserTableItem = (props: UserTableItemProps) => {
	const { attributes, listeners, setNodeRef, transform, transition } =
		useSortable({ id: props.id });

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
	};
	return (
		<div ref={setNodeRef} style={style} {...attributes} {...listeners}>
			<div className="p-4 border select-none">{props.name}</div>
		</div>
	);
};

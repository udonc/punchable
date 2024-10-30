"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";

type UserTableItemProps = {
	id: string;
	name: string;
	slug: string;
};

export const UserTableItem = (props: UserTableItemProps) => {
	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable({ id: props.id });

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
	};
	return (
		<label
			data-dragging={isDragging}
			ref={setNodeRef}
			style={style}
			className="data-[dragging=true]:opacity-0 bg-background p-2 border select-none flex items-center gap-1 rounded-md group has-[:checked]:bg-primary has-[:checked]:text-primary-foreground"
			{...attributes}
		>
			<input type="radio" name="_" className="hidden" />
			<div
				className="hover:bg-muted p-1 rounded group-hover:visible invisible"
				{...listeners}
			>
				<GripVertical size={14} className="cursor-move text-muted-foreground" />
			</div>
			<div className="text-nowrap text-ellipsis overflow-hidden">
				{props.name}
			</div>
		</label>
	);
};

"use client";

import { GripVertical } from "lucide-react";

type UserTableItemDragOverlayProps = {
	id: string;
	name: string;
	slug: string;
};

export const UserTableItemDragOverlay = (
	props: UserTableItemDragOverlayProps,
) => {
	return (
		<div className="data-[dragging=true]:opacity-0 bg-background p-2 border select-none flex items-center gap-1 rounded-md group has-[:checked]:bg-primary has-[:checked]:text-primary-foreground">
			<div className="hover:bg-muted p-1 rounded group-hover:visible invisible">
				<GripVertical size={14} className="cursor-move text-muted-foreground" />
			</div>
			<div className="text-nowrap text-ellipsis overflow-hidden text-sm">
				{props.name}
			</div>
		</div>
	);
};

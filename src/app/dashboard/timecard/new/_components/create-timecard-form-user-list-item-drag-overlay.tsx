"use client";

import { GripVertical } from "lucide-react";
import { ReactNode } from "react";

type CreateTimecardUserListItemDragOverlayProps = {
	children: ReactNode;
};

export const CreateTimecardUserListItemDragOverlay = ({
	children,
}: CreateTimecardUserListItemDragOverlayProps) => {
	return (
		<div className="bg-background p-2 border select-none rounded-md has-[:checked]:bg-primary has-[:checked]:text-primary-foreground group space-y-0">
			<div className="flex items-center gap-1" tabIndex={-1}>
				<div className="hover:bg-muted p-1 rounded group-hover:visible invisible">
					<GripVertical
						size={14}
						className="cursor-move text-muted-foreground"
					/>
				</div>
				<div className="text-nowrap text-ellipsis overflow-hidden text-sm font-semibold">
					{children}
				</div>
			</div>
		</div>
	);
};

"use client";

import { GripVertical } from "lucide-react";
import { ReactNode } from "react";

type CreateTimecardUserListItemDragOverlayProps = {
	checked: boolean;
	children: ReactNode;
};

export const CreateTimecardUserListItemDragOverlay = ({
	checked,
	children,
}: CreateTimecardUserListItemDragOverlayProps) => {
	return (
		<div
			data-checked={checked}
			className="relative px-4 py-3 flex items-center gap-1 d bg-background border select-none rounded-md data-[checked=true]:bg-primary data-[checked=true]:text-primary-foreground group space-y-0"
		>
			<div className="flex items-center gap-1">
				<div className="text-nowrap text-ellipsis overflow-hidden text-sm leading-none font-semibold">
					{children}
				</div>
				<div className="absolute left-0 -translate-x-1/2 hover:bg-muted p-1 rounded bg-background border group-hover:visible invisible">
					<GripVertical
						size={12}
						className="cursor-move text-muted-foreground"
					/>
				</div>
			</div>
		</div>
	);
};

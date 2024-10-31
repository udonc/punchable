"use client";

import { FormControl, FormItem } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { RadioGroupItem } from "@/components/ui/radio-group";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import { ReactNode } from "react";

type CreateTimecardFormUserListItem = {
	user: {
		id: string;
		name: string;
		slug: string;
	};
	value: string;
	children: ReactNode;
};

export const CreateTimecardFormUserListItem = ({
	user,
	value,
	children,
}: CreateTimecardFormUserListItem) => {
	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable({ id: user.id });

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
	};

	return (
		<FormItem tabIndex={-1}>
			<Label
				data-dragging={isDragging}
				ref={setNodeRef}
				style={style}
				{...attributes}
				className="flex items-center gap-1 data-[dragging=true]:opacity-0 bg-background p-2 border select-none rounded-md has-[:checked]:bg-primary has-[:checked]:text-primary-foreground group space-y-0"
			>
				<FormControl className="sr-only">
					<RadioGroupItem value={value} />
				</FormControl>
				<div
					className="hover:bg-muted p-1 rounded group-hover:visible invisible"
					{...listeners}
				>
					<GripVertical
						size={14}
						className="cursor-move text-muted-foreground"
					/>
				</div>
				<div className="text-nowrap text-ellipsis overflow-hidden">
					{children}
				</div>
			</Label>
		</FormItem>
	);
};
